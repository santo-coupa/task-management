using task_management_backend.Database;
using task_management_backend.Dto.Tasks;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Services;

public class TaskService : ITaskService
{
  private readonly ApplicationDbContext DbContext;

  public TaskService(ApplicationDbContext dbContext)
  {
    DbContext = dbContext;
  }

  UserTask ITaskService.CreateTask(CreateTaskRequest request)
  {
    var userExists = DbContext.Users.Any(u => u.Id == request.AssignedUserId);

    if (!userExists)
    {
      throw new ArgumentException($"User with id {request.AssignedUserId} not found");
    }

    var task = new UserTask
    {
      Id = Guid.CreateVersion7(),
      Title = request.Title,
      Status = request.Status,
      AssignedUserId = request.AssignedUserId
    };

    DbContext.UserTasks.Add(task);
    DbContext.SaveChanges();

    return task;
  }

  public UserTask UpdateTask(Guid id, UpdateTaskRequest request)
  {
    var task = DbContext.UserTasks.FirstOrDefault(t => t.Id == id);
    if (task == null)
      throw new ArgumentException($"Task with id {id} not found");

    if (!string.IsNullOrEmpty(request.Title))
    {
      task.Title = request.Title;
    }

    if (request.Status.HasValue)
    {
      task.Status = request.Status.Value;
    }

    if (request.AssignedUserId.HasValue)
    {
      task.AssignedUserId = request.AssignedUserId.Value;
    }
    DbContext.SaveChanges();
    return task;
  }
}
