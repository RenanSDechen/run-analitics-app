namespace RunAnalitics.Api.Dtos;

public class DashboardSummaryDto
{
    // Totais
    public double TotalDistance { get; set; }
    public string TotalTime { get; set; } = "0h 0m";
    public int TotalRuns { get; set; }

    // Último Treino Realizado
    public LastRunDto? LastRun { get; set; }

    // Meta Semanal
    public double WeeklyGoalTotal { get; set; } // O quanto deveria correr
    public double WeeklyGoalDone { get; set; }  // O quanto já correu
}

public class LastRunDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public double Distance { get; set; }
    public string Duration { get; set; } = string.Empty; // Calculado
    public string Pace { get; set; } = string.Empty;
    public DateTime Date { get; set; }
}