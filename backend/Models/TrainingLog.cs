using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace RunAnalitics.Api.Models;

public enum WorkoutStatus
{
    Pending = 0,   // Planejado, ainda não chegou a data ou não feito
    Completed = 1, // Feito
    Missed = 2,    // Passou a data e não fez
    Skipped = 3    // Usuário pulou intencionalmente
}

public class TrainingLog
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    // --- DADOS PLANEJADOS (Metas) ---
    public string Type { get; set; } = string.Empty; 
    public double Distance { get; set; } 
    public string Pace { get; set; } = string.Empty; 
    public DateTime Date { get; set; }
    public bool IsPlanned { get; set; } = true;

    // --- DADOS REALIZADOS (O que aconteceu de verdade) ---
    public double? ActualDistance { get; set; } // Nullable
    public string? ActualPace { get; set; }     // Nullable
    public string? UserNotes { get; set; }      // Sensação do atleta
    
    public WorkoutStatus Status { get; set; } = WorkoutStatus.Pending;

    public Guid UserId { get; set; }
    [JsonIgnore]
    public User? User { get; set; } 
}