namespace task_management_backend.Dto.Tasks;

public class UpdateTaskRequest
{
  public string? Title { get; set; } = null!;
  public Enums.UserTaskStatus? Status { get; set; }
  public Guid? AssignedUserId { get; set; }
}
