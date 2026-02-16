namespace task_management_backend.Dto.Users;

public class UpdateUserRequest
{
  public string? Username { get; set; }

  public string? FirstName { get; set; }

  public string? LastName { get; set; }

  public string? Email { get; set; }

  public string? Title { get; set; }

  public bool? IsActive { get; set; }

  public string? Password { get; set; }
}
