namespace task_management_backend.Dto.Profile;

public class UpdateProfileRequest
{
  public string? FirstName { get; set; }
  public string? LastName { get; set; }
  public string? Email { get; set; }
  public string? Title { get; set; }
  public string? Password { get; set; }
  public string? ConfirmPassword { get; set; }
}
