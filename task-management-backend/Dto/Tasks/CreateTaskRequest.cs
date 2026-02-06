using task_management_backend.Enums;

namespace task_management_backend.Dto.Tasks;

public class CreateTaskRequest
{
  public string Title { get; set; } = null!;
  public UserTaskStatus Status { get; set; }
  public Guid AssignedUserId { get; set; }
}
