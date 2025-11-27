using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RunAnalitics.Api.Data;
using RunAnalitics.Api.Dtos;
using RunAnalitics.Api.Models;
using RunAnalitics.Api.Services;

namespace RunAnalitics.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkoutController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly WorkoutGeneratorService _workoutGenerator;

    // Construtor: Injeção de Dependência
    public WorkoutController(AppDbContext context, WorkoutGeneratorService workoutGenerator)
    {
        _context = context;
        _workoutGenerator = workoutGenerator;
    }

    // 1. Endpoint de Histórico (Para o Dashboard)
    [HttpGet("history/{userId}")]
    public async Task<IActionResult> GetHistory(Guid userId)
    {
        var logs = await _context.TrainingLogs
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.Date)
            .ToListAsync();

        return Ok(logs);
    }

    // 2. Endpoint de Adicionar Treino (Para o Modal da Dashboard)
    [HttpPost]
    public async Task<IActionResult> AddWorkout([FromQuery] Guid userId, [FromBody] CreateWorkoutDto dto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound("Usuário não encontrado.");

        var log = new TrainingLog
        {
            UserId = userId,
            Type = dto.Type,
            Distance = dto.Distance,
            Pace = dto.Pace,
            Date = dto.Date,
            IsPlanned = false // Treino realizado pelo usuário
        };

        _context.TrainingLogs.Add(log);
        await _context.SaveChangesAsync();

        return Ok(log);
    }

    // 3. Endpoint de Preview (Para a Venda/Signup) - NOVO
    // Este endpoint não salva no banco, apenas calcula.
    [HttpPost("preview")]
    [AllowAnonymous] // Permite acesso sem Token JWT
    public IActionResult GetPlanPreview([FromBody] PlanDetailsDto details)
    {
        // Gera um ID falso apenas para a lógica rodar
        var dummyUserId = Guid.NewGuid(); 
        var startDate = DateTime.UtcNow;

        // Usa a mesma inteligência que usamos no cadastro
        var previewLogs = _workoutGenerator.GeneratePlan(dummyUserId, details, startDate);

        return Ok(previewLogs);
    }

    [HttpGet("pending/{userId}")]
    public async Task<IActionResult> GetPendingWorkouts(Guid userId)
    {
        var today = DateTime.UtcNow.Date.AddDays(1); // Inclui o dia de hoje inteiro

        var pendingLogs = await _context.TrainingLogs
            .Where(l => l.UserId == userId 
                        && l.Status == WorkoutStatus.Pending 
                        && l.IsPlanned == true
                        && l.Date <= today) // BLOQUEIA O FUTURO AQUI
            .OrderBy(l => l.Date) // Mostra os mais antigos primeiro (para "fechar desde o começo")
            .ToListAsync();

        return Ok(pendingLogs);
    }

    // NOVO: Marca o treino como concluído
    [HttpPut("complete/{id}")]
    public async Task<IActionResult> CompleteWorkout(Guid id, [FromBody] CompleteWorkoutDto dto)
    {
        var log = await _context.TrainingLogs.FindAsync(id);
        if (log == null) return NotFound("Treino não encontrado");

        // Atualiza com os dados reais
        log.ActualDistance = dto.ActualDistance;
        log.ActualPace = dto.ActualPace;
        log.UserNotes = dto.UserNotes;
        log.Status = WorkoutStatus.Completed; // Muda status

        await _context.SaveChangesAsync();

        return Ok(log);
    }

    [HttpGet("summary/{userId}")]
    public async Task<IActionResult> GetDashboardSummary(Guid userId)
    {
        // 1. Busca todos os treinos CONCLUÍDOS do usuário
        var completedLogs = await _context.TrainingLogs
            .Where(l => l.UserId == userId && l.Status == WorkoutStatus.Completed)
            .OrderByDescending(l => l.Date)
            .ToListAsync();

        // 2. Busca o plano da SEMANA ATUAL (para a barra de progresso)
        var today = DateTime.UtcNow.Date;
        // Acha o domingo passado (início da semana) e o próximo sábado
        var startOfWeek = today.AddDays(-(int)today.DayOfWeek);
        var endOfWeek = startOfWeek.AddDays(7);

        var weeklyPlan = await _context.TrainingLogs
            .Where(l => l.UserId == userId 
                   && l.IsPlanned == true 
                   && l.Date >= startOfWeek 
                   && l.Date < endOfWeek)
            .ToListAsync();

        // --- CÁLCULOS ---

        // A. Totais Gerais
        double totalDist = completedLogs.Sum(l => l.ActualDistance ?? 0);
        int totalRuns = completedLogs.Count;
        
        // Cálculo aproximado de Tempo Total (Baseado em Pace Médio e Distância)
        // Pace "5:00" = 5 min/km. 10km = 50 min.
        double totalMinutes = 0;
        foreach (var log in completedLogs)
        {
            if (log.ActualDistance.HasValue && !string.IsNullOrEmpty(log.ActualPace))
            {
                totalMinutes += CalculateMinutes(log.ActualDistance.Value, log.ActualPace);
            }
        }
        
        // Formata tempo (ex: "12h 30m")
        TimeSpan t = TimeSpan.FromMinutes(totalMinutes);
        string totalTimeStr = $"{(int)t.TotalHours}h {t.Minutes}m";

        // B. Último Treino
        LastRunDto? lastRunDto = null;
        var lastLog = completedLogs.FirstOrDefault(); // Já ordenamos por data desc
        if (lastLog != null)
        {
            double durationMin = CalculateMinutes(lastLog.ActualDistance ?? 0, lastLog.ActualPace ?? "0:00");
            TimeSpan durationSpan = TimeSpan.FromMinutes(durationMin);
            
            lastRunDto = new LastRunDto
            {
                Id = lastLog.Id,
                Type = lastLog.Type,
                Distance = lastLog.ActualDistance ?? 0,
                Pace = lastLog.ActualPace ?? "-",
                Date = lastLog.Date,
                Duration = $"{(int)durationSpan.TotalMinutes}:{durationSpan.Seconds:D2}" // Ex: 45:30
            };
        }

        // C. Meta Semanal
        // Meta: Soma da distância planejada para a semana
        double weeklyTarget = weeklyPlan.Sum(l => l.Distance);
        // Realizado: Soma da distância real dos treinos dessa semana
        double weeklyDone = completedLogs
            .Where(l => l.Date >= startOfWeek && l.Date < endOfWeek)
            .Sum(l => l.ActualDistance ?? 0);

        var summary = new DashboardSummaryDto
        {
            TotalDistance = Math.Round(totalDist, 1),
            TotalRuns = totalRuns,
            TotalTime = totalTimeStr,
            LastRun = lastRunDto,
            WeeklyGoalTotal = Math.Round(weeklyTarget, 1),
            WeeklyGoalDone = Math.Round(weeklyDone, 1)
        };

        return Ok(summary);
    }

    // Método Auxiliar para converter "5:30" (pace) e Distância em Minutos
    private double CalculateMinutes(double distance, string pace)
    {
        try
        {
            var parts = pace.Split(':');
            if (parts.Length != 2) return 0;
            double paceInMinutes = double.Parse(parts[0]) + (double.Parse(parts[1]) / 60.0);
            return distance * paceInMinutes;
        }
        catch
        {
            return 0; // Se o pace estiver mal formatado, ignora
        }
    }
}