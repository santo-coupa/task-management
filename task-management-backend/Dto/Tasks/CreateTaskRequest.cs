namespace task_management_backend.Dto.Tasks;
using TaskStatusEnum = task_management_backend.Enums.TaskStatus;

public class CreateTaskRequest
{
  public string Title { get; set; } = null!;
  public TaskStatusEnum Status { get; set; }
  public Guid AssignedUserId { get; set; }
}
