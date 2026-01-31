namespace task_management_backend.Dto.Tasks;
using TaskStatusEnum = task_management_backend.Enums.TaskStatus;

public class GetTaskResponse
{
  public int Id { get; set; }
  public string Title { get; set; } = null!;
  public TaskStatus Status { get; set; }
  public Guid AssignedUserId { get; set; }
}

