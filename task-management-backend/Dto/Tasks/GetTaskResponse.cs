using task_management_backend.Enums;
namespace task_management_backend.Dto.Tasks;

public class GetTaskResponse
{
  public Guid Id { get; set; }

  public string Name { get; set; } = string.Empty;

  public string? Description { get; set; }

  public UserTaskStatus Status { get; set; }

  public Guid? AssigneeId { get; set; }

  public Guid CreatedById { get; set; }

  public DateTime CreatedAt { get; set; }

  public DateTime? UpdatedAt { get; set; }

  public DateTime? DueDate { get; set; }
}

