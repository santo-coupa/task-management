using Microsoft.EntityFrameworkCore;
using task_management_backend.Database;

namespace task_management_backend;

public class ApplicationDbContext : DbContext
{
  public ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options)
    : base(options)
  {
  }

  public DbSet<User> Users { get; set; }

  public DbSet<UserTask> UserTasks { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.Entity<UserTask>()
      .HasOne(t => t.CreatedBy)
      .WithMany(u => u.CreatedTasks)
      .HasForeignKey(t => t.CreatedById)
      .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<UserTask>()
      .HasOne(t => t.Assignee)
      .WithMany(u => u.AssignedTasks)
      .HasForeignKey(t => t.AssigneeId)
      .OnDelete(DeleteBehavior.Restrict);

    base.OnModelCreating(modelBuilder);
  }
}
