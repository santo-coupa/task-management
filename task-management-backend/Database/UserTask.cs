using System.ComponentModel.DataAnnotations.Schema;
namespace task_management_backend.Database;
using task_management_backend.Enums;

[Table("UserTasks")]
public class UserTask
{
  public Guid Id { get; set; }

  public string Name { get; set; } = string.Empty;

  public string? Description { get; set; }

  public UserTaskStatus Status { get; set; } = UserTaskStatus.ToDo;

  public Guid? AssigneeId { get; set; }

  public User? Assignee { get; set; }

  public Guid CreatedById { get; set; }

  public User CreatedBy { get; set; } = null!;

  public DateTime CreatedAt { get; set; }

  public DateTime? UpdatedAt { get; set; }

  public DateTime? DueDate { get; set; }
}
