using task_management_backend.Enums;

namespace task_management_backend.Dto.Tasks;

public class UpdateTaskRequest
{
  public string? Name { get; set; }

  public string? Description { get; set; }

  public UserTaskStatus? Status { get; set; }

  public Guid? AssigneeId { get; set; }

  public DateTime? DueDate { get; set; }
}
