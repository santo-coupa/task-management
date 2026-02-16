using task_management_backend.Enums;
public class CreateUserRequest
{
  public required string Username { get; set; }

  public required string Email { get; set; }

  public required string Password { get; set; }

  public string? FirstName { get; set; }

  public string? LastName { get; set; }

  public string? Title { get; set; }

  public UserRole? Role { get; set; }

  public bool? IsActive { get; set; }
}

