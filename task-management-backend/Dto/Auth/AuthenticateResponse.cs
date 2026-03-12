using task_management_backend.Enums;
namespace task_management_backend.Dto.Auth;

public class AuthenticateResponse
{
  public Guid UserId { get; set; }
  public string Username { get; set; }
  public string Email { get; set; }
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public UserRole Role { get; set; }
  public string Token { get; set; }
}

