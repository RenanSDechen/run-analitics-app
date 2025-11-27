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
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;
    private readonly WorkoutGeneratorService _workoutGenerator;

    // Construtor: Injeção de Dependência
    public AuthController(
        AppDbContext context, 
        TokenService tokenService,
        WorkoutGeneratorService workoutGenerator)
    {
        _context = context;
        _tokenService = tokenService;
        _workoutGenerator = workoutGenerator;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        // 1. Validação de Email
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest("Este email já está em uso.");
        }

        // 2. Criação do Usuário
        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            CreatedAt = DateTime.UtcNow
        };

        // 3. Criação do Plano
        var plan = new WorkoutPlan
        {
            Sport = dto.PlanDetails.Sport,
            Goal = dto.PlanDetails.Goal,
            WeeksDuration = dto.PlanDetails.Weeks,
            WorkoutsPerWeek = dto.PlanDetails.WorkoutsPerWeek,
            User = user
        };

        // 4. GERAÇÃO DOS TREINOS (O Pulo do Gato)
        // Usamos o serviço para gerar o calendário completo
        var generatedLogs = _workoutGenerator.GeneratePlan(user.Id, dto.PlanDetails, DateTime.UtcNow);
        
        // 5. Salvar tudo no Banco
        _context.Users.Add(user);
        _context.WorkoutPlans.Add(plan);
        _context.TrainingLogs.AddRange(generatedLogs);

        await _context.SaveChangesAsync();

        // 6. Gerar Token e Retornar
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