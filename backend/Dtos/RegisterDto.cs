using System.ComponentModel.DataAnnotations;

namespace RunAnalitics.Api.Dtos;

// Essa classe ajuda a organizar os dados do plano dentro do registro
public class PlanDetailsDto
{
    public string Sport { get; set; } = string.Empty;
    public string Goal { get; set; } = string.Empty;
    public int Weeks { get; set; }
    public string WorkoutsPerWeek { get; set; } = string.Empty;
}

// Essa é a classe principal que o Controller espera receber
public class RegisterDto
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    // Aqui está o objeto aninhado com os detalhes do plano
    public PlanDetailsDto PlanDetails { get; set; } = new();
    public string CaptchaToken { get; set; } = string.Empty;
}