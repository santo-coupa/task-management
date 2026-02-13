using task_management_backend.Enums;
namespace task_management_backend.Dto.Auth;

public class AuthenticateResponse
{
  public string Token { get; set; }
  public string Username { get; set; }
  public string Email { get; set; }
  public UserRole Role { get; set; }
}

