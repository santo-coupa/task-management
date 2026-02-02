using System.ComponentModel.DataAnnotations.Schema;
namespace task_management_backend.Database;
using task_management_backend.Enums;

[Table("UserTasks")]
public class UserTask
{
  public Guid Id { get; set; }
  public string Title { get; set; } = null!;
  public TaskStatus Status { get; set; }

  public Guid AssignedUserId { get; set; }
  public User AssignedUser { get; set; } = null!;
}
