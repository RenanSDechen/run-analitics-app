using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace RunAnalitics.Api.Models;

public class WorkoutPlan
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Sport { get; set; } = string.Empty; // "Running", "Cycling"
    public string Goal { get; set; } = string.Empty;  // "5k", "Marathon"
    public int WeeksDuration { get; set; }
    public string WorkoutsPerWeek { get; set; } = string.Empty;

    // Chave Estrangeira para o Usuário
    public Guid UserId { get; set; }
    
    [JsonIgnore] // Evita loops infinitos ao serializar
    public User? User { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}