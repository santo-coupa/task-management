using task_management_backend.Enums;

namespace task_management_backend.Dto.Tasks;

public class CreateTaskRequest
{
  public required string Name { get; set; }

  public string? Description { get; set; }

  public Guid? AssigneeId { get; set; }

  public DateTime? DueDate { get; set; }
}
