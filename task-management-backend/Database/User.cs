using task_management_backend.Enums;

namespace task_management_backend.Database;

public class User
{
  public Guid Id { get; set; }

  public string Username { get; set; } = string.Empty;

  public string? FirstName { get; set; }

  public string? LastName { get; set; }

  public string Email { get; set; } = string.Empty;

  public string PasswordHashed { get; set; } = string.Empty;

  public UserRole Role { get; set; } = UserRole.User;

  public string? Title { get; set; }

  public bool IsActive { get; set; } = true;

  public DateTime CreatedAt { get; set; }

  public DateTime? UpdatedAt { get; set; }

  public List<UserTask> CreatedTasks { get; set; } = new();

  public List<UserTask> AssignedTasks { get; set; } = new();
}
