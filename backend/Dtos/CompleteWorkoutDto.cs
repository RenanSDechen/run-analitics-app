namespace RunAnalitics.Api.Dtos;

public class CompleteWorkoutDto
{
    public double ActualDistance { get; set; }
    public string ActualPace { get; set; } = string.Empty;
    public string UserNotes { get; set; } = string.Empty;
}