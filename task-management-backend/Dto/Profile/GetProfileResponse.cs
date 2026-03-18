using task_management_backend.Enums;

namespace task_management_backend.Dto.Profile;

public class GetProfileResponse
{
  public Guid Id { get; set; }
  public string Username { get; set; } = string.Empty;
  public string Email { get; set; } = string.Empty;
  public UserRole Role { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Title { get; set; }
  public DateTime CreatedAt { get; set; }
  public DateTime? UpdatedAt { get; set; }
}
