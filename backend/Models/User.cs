using System.ComponentModel.DataAnnotations;

namespace RunAnalitics.Api.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    // Sênior: Nunca salvamos a senha pura. Apenas o Hash.
    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relacionamentos (Navigation Properties)
    // Um usuário pode ter um Plano e vários Treinos realizados
    public WorkoutPlan? CurrentPlan { get; set; }
    public List<TrainingLog> TrainingLogs { get; set; } = new();
}