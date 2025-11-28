using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunAnalitics.Api.Data;
using RunAnalitics.Api.Dtos;
using RunAnalitics.Api.Models;
using RunAnalitics.Api.Services;
using BCrypt.Net;

namespace RunAnalitics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Campos privados para injeção de dependência
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly WorkoutGeneratorService _workoutGenerator;
    private readonly CaptchaService _captchaService;

    // CONSTRUTOR: AQUI ESTAVA O ERRO
    // Observe como as atribuições estão DENTRO das chaves { }
    public AuthController(
        AppDbContext context, 
        TokenService tokenService,
        WorkoutGeneratorService workoutGenerator,
        CaptchaService captchaService)
    {
        _context = context;
        _tokenService = tokenService;
        _workoutGenerator = workoutGenerator;
        _captchaService = captchaService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // 1. VALIDAÇÃO ANTI-ROBÔ (CAPTCHA)
        // Se estiver rodando localmente sem internet ou sem chaves, 
        // você pode comentar esse bloco temporariamente para testar, 
        // mas em produção é essencial.
        bool isHuman = await _captchaService.VerifyToken(dto.CaptchaToken);
        if (!isHuman)
        {
             return BadRequest("Falha na verificação de segurança (CAPTCHA).");
        }

        // 2. Validação de Email Duplicado
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest("Este email já está em uso.");
        }

        // 3. Criação do Usuário
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        // 4. Criação do Plano Base
        var plan = new WorkoutPlan
        {
            Sport = dto.PlanDetails.Sport,
            Goal = dto.PlanDetails.Goal,
            WeeksDuration = dto.PlanDetails.Weeks,
            WorkoutsPerWeek = dto.PlanDetails.WorkoutsPerWeek,
            User = user
        };

        // 5. Geração Inteligente dos Treinos
        var generatedLogs = _workoutGenerator.GeneratePlan(user.Id, dto.PlanDetails, DateTime.UtcNow);
        
        // 6. Persistência (Salvar no Banco)
        _context.Users.Add(user);
        _context.WorkoutPlans.Add(plan);
        _context.TrainingLogs.AddRange(generatedLogs);

        await _context.SaveChangesAsync();

        // 7. Geração do Token de Acesso
        var token = _tokenService.GenerateToken(user);

        return Ok(new { userId = user.Id, name = user.Name, token = token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users
            .Include(u => u.CurrentPlan)
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            return Unauthorized("Email ou senha inválidos.");
        }

        var token = _tokenService.GenerateToken(user);

        return Ok(new { 
            userId = user.Id, 
            name = user.Name, 
            email = user.Email,
            plan = user.CurrentPlan,
            token = token 
        });
    }
}