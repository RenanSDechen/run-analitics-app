using RunAnalitics.Api.Dtos;
using RunAnalitics.Api.Models;

namespace RunAnalitics.Api.Services;

public class WorkoutGeneratorService
{
    public List<TrainingLog> GeneratePlan(Guid userId, PlanDetailsDto details, DateTime startDate)
    {
        var planLogs = new List<TrainingLog>();
        int weeks = details.Weeks;
        
        // Tratamento de frequência
        string freqString = string.IsNullOrEmpty(details.WorkoutsPerWeek) ? "3" : details.WorkoutsPerWeek;
        int frequency = int.Parse(freqString.Replace("+", ""));

        // Define o volume inicial (em KM) baseado no Esporte e Objetivo
        double baseVolume = GetBaseVolume(details.Sport, details.Goal);
        
        // Fator de evolução semanal (varia por esporte)
        double weeklyIncrement = details.Sport == "swimming" ? 1.05 : 1.1; // Natação evolui mais devagar (5%)

        for (int w = 1; w <= weeks; w++)
        {
            // Periodização: Recuperação a cada 4 semanas e Polimento no final
            double currentLoadFactor = 1.0;
            if (w == weeks) currentLoadFactor = 0.5; // Tapering final
            else if (w == weeks - 1) currentLoadFactor = 0.75;
            else if (w % 4 == 0) currentLoadFactor = 0.8; // Recovery Week

            // Calcula o volume base desta semana
            double weeklyBaseVolume = Math.Round(baseVolume * Math.Pow(weeklyIncrement, w - 1) * currentLoadFactor, 1);

            // Delega para o gerador específico do esporte
            var weeklyWorkouts = GenerateSpecificWorkouts(
                details.Sport, 
                w, 
                frequency, 
                weeklyBaseVolume, 
                startDate, 
                userId
            );

            planLogs.AddRange(weeklyWorkouts);
            startDate = startDate.AddDays(7);
        }

        return planLogs;
    }

    // --- 1. DEFINIÇÃO DE VOLUME BASE (EM KM) ---
    private double GetBaseVolume(string sport, string goal)
    {
        // Retorna a distância do "Treino Longo" inicial
        return sport switch
        {
            "running" => goal switch {
                "5k" => 3.0, "10k" => 5.0, "half_marathon" => 8.0, "marathon" => 12.0, _ => 5.0
            },
            "cycling" => goal switch {
                "20km_ride" => 15.0, "50km_ride" => 30.0, "gran_fondo" => 60.0, "improve_ftp" => 25.0, _ => 20.0
            },
            "swimming" => goal switch {
                "500m_swim" => 0.3, "open_water" => 0.8, "marathon_swim" => 1.5, "technique" => 0.5, _ => 0.5
            },
            "triathlon" => goal switch {
                "sprint" => 10.0, // Bike base
                "olympic" => 20.0, 
                "70.3" => 40.0, 
                "140.6" => 60.0, 
                _ => 20.0
            },
            _ => 5.0
        };
    }

    // --- 2. ORQUESTRADOR DE TREINOS ---
    private List<TrainingLog> GenerateSpecificWorkouts(string sport, int weekNum, int freq, double volume, DateTime startOfWeek, Guid userId)
    {
        return sport switch
        {
            "running" => GenerateRunningWeek(weekNum, freq, volume, startOfWeek, userId),
            "cycling" => GenerateCyclingWeek(weekNum, freq, volume, startOfWeek, userId),
            "swimming" => GenerateSwimmingWeek(weekNum, freq, volume, startOfWeek, userId),
            "triathlon" => GenerateTriathlonWeek(weekNum, freq, volume, startOfWeek, userId),
            _ => GenerateRunningWeek(weekNum, freq, volume, startOfWeek, userId) // Fallback
        };
    }

    // === LÓGICA ESPECÍFICA: CORRIDA ===
    private List<TrainingLog> GenerateRunningWeek(int week, int freq, double longDist, DateTime start, Guid userId)
    {
        var logs = new List<TrainingLog>();
        logs.Add(CreateLog(userId, start.AddDays(1), "Running", "Tiros de Velocidade", longDist * 0.4, "Rápido (Z4)"));
        if (freq >= 3) logs.Add(CreateLog(userId, start.AddDays(3), "Running", "Tempo Run", longDist * 0.6, "Moderado (Z3)"));
        logs.Add(CreateLog(userId, start.AddDays(6), "Running", "Longão", longDist, "Conversação (Z2)"));
        if (freq >= 4) logs.Add(CreateLog(userId, start.AddDays(2), "Running", "Rodagem Leve", longDist * 0.3, "Muito Leve (Z1)"));
        return logs;
    }

    // === LÓGICA ESPECÍFICA: CICLISMO (Volumes maiores) ===
    private List<TrainingLog> GenerateCyclingWeek(int week, int freq, double longDist, DateTime start, Guid userId)
    {
        var logs = new List<TrainingLog>();
        // Ciclismo tem muito volume. 
        logs.Add(CreateLog(userId, start.AddDays(1), "Cycling", "Intervalos de Potência", longDist * 0.5, "Força"));
        if (freq >= 3) logs.Add(CreateLog(userId, start.AddDays(3), "Cycling", "Giro de Cadência", longDist * 0.7, "Alta Rotação"));
        logs.Add(CreateLog(userId, start.AddDays(6), "Cycling", "Long Ride", longDist, "Endurance"));
        if (freq >= 4) logs.Add(CreateLog(userId, start.AddDays(4), "Cycling", "Subidas (Climbing)", longDist * 0.4, "Pesado"));
        return logs;
    }

    // === LÓGICA ESPECÍFICA: NATAÇÃO (Volumes menores, Foco técnico) ===
    private List<TrainingLog> GenerateSwimmingWeek(int week, int freq, double longDist, DateTime start, Guid userId)
    {
        var logs = new List<TrainingLog>();
        // longDist aqui entra como KM (ex: 1.5).
        
        logs.Add(CreateLog(userId, start.AddDays(1), "Swimming", "Educativos (Drills)", longDist * 0.4, "Foco Técnica"));
        if (freq >= 3) logs.Add(CreateLog(userId, start.AddDays(3), "Swimming", "Séries Anaeróbicas", longDist * 0.5, "Explosão"));
        logs.Add(CreateLog(userId, start.AddDays(6), "Swimming", "Endurance Swim", longDist, "Ritmo Constante"));
        
        if (freq >= 4) logs.Add(CreateLog(userId, start.AddDays(4), "Swimming", "Recuperação Ativa", longDist * 0.3, "Solto"));
        return logs;
    }

    // === LÓGICA ESPECÍFICA: TRIATHLON (Mix de modalidades) ===
    private List<TrainingLog> GenerateTriathlonWeek(int week, int freq, double baseVol, DateTime start, Guid userId)
    {
        var logs = new List<TrainingLog>();
        
        // Triathlon precisa distribuir os 3 esportes.
        // baseVol aqui é baseado na BIKE (maior volume). Vamos ajustar para os outros.

        // Terça: Natação
        logs.Add(CreateLog(userId, start.AddDays(1), "Swimming", "Séries Técnicas", baseVol * 0.05, "Moderado")); // Ex: 20km bike -> 1km swim
        
        // Quinta: Ciclismo
        if (freq >= 3) logs.Add(CreateLog(userId, start.AddDays(3), "Cycling", "Treino de Base", baseVol * 0.7, "Z2/Z3"));

        // Domingo: Corrida (ou Brick)
        logs.Add(CreateLog(userId, start.AddDays(6), "Running", "Long Run", baseVol * 0.25, "Endurance")); // Ex: 20km bike -> 5km run

        // Quarta: Ciclismo ou Corrida Extra
        if (freq >= 4) logs.Add(CreateLog(userId, start.AddDays(2), "Cycling", "Giro Leve", baseVol * 0.5, "Recuperação"));
        
        // Sábado: Brick (Bike + Run) - Simulado
        if (freq >= 5) logs.Add(CreateLog(userId, start.AddDays(5), "Triathlon", "Treino Brick (Bike+Run)", baseVol * 0.4, "Transição Rápida"));

        return logs;
    }

    // --- HELPER PARA CRIAR O LOG ---
    private TrainingLog CreateLog(Guid userId, DateTime date, string category, string typeName, double dist, string pace)
    {
        return new TrainingLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Date = date,
            Type = $"{category} - {typeName}", // Ex: "Swimming - Drills"
            Distance = Math.Round(dist, 2), // Arredonda 2 casas (bom para natação ex: 1.25km)
            Pace = pace,
            IsPlanned = true
        };
    }
}