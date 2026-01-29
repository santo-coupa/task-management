namespace task_management_backend.Dto;

public class GetUserResponse
{
  public Guid Id { get; set; }
  public string Username { get; set; }
  public string Email { get; set; }
}
