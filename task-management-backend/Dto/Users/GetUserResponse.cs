using task_management_backend.Enums;

namespace task_management_backend.Dto;

public class GetUserResponse
{
  public Guid Id { get; set; }

  public string Username { get; set; } = string.Empty;

  public string? FirstName { get; set; }

  public string? LastName { get; set; }

  public string Email { get; set; } = string.Empty;

  public UserRole Role { get; set; }

  public string? Title { get; set; }

  public bool IsActive { get; set; }

  public DateTime CreatedAt { get; set; }

  public DateTime? UpdatedAt { get; set; }
}
