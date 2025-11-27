using Microsoft.EntityFrameworkCore;
using RunAnalitics.Api.Models;

namespace RunAnalitics.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Aqui definimos quais classes viram tabelas
    public DbSet<User> Users { get; set; }
    public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
    public DbSet<TrainingLog> TrainingLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configurações adicionais de relacionamento (Fluent API)
        
        // Um Usuário tem UM Plano
        modelBuilder.Entity<User>()
            .HasOne(u => u.CurrentPlan)
            .WithOne(p => p.User)
            .HasForeignKey<WorkoutPlan>(p => p.UserId);

        // Um Usuário tem MUITOS Logs
        modelBuilder.Entity<User>()
            .HasMany(u => u.TrainingLogs)
            .WithOne(l => l.User)
            .HasForeignKey(l => l.UserId);

        // Garante que o Email seja único no banco
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}