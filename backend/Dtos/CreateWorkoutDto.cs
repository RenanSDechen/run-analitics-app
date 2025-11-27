using System.ComponentModel.DataAnnotations;

namespace RunAnalitics.Api.Dtos;

public class CreateWorkoutDto
{
    [Required]
    public string Type { get; set; } = string.Empty; // Ex: "Longo", "Tiro"

    [Required]
    public double Distance { get; set; } // Ex: 10.5

    [Required]
    public string Pace { get; set; } = string.Empty; // Ex: "5:30"

    [Required]
    public DateTime Date { get; set; }
}