using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using task_management_backend.Database;
using task_management_backend.Dto.Tasks;
using task_management_backend.Enums;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Services;

public class TaskService : ITaskService
{
    private readonly ApplicationDbContext DbContext;
    public TaskService(ApplicationDbContext dbContext)
    {
      DbContext = dbContext;
    }

    public IEnumerable<UserTask> GetTasks()
    {
        return DbContext.UserTasks.ToList();
    }

    public UserTask CreateTask(CreateTaskRequest request, Guid currentUserId)
    {
      if (request.AssigneeId.HasValue)
      {
        var userExists = DbContext.Users
          .Any(u => u.Id == request.AssigneeId.Value);

        if (!userExists)
          throw new ArgumentException("Assignee not found");
      }

      var task = new UserTask
      {
        Id = Guid.CreateVersion7(),
        Name = request.Name,
        Description = request.Description,
        Status = UserTaskStatus.ToDo,
        AssigneeId = request.AssigneeId,
        CreatedById = currentUserId,
        CreatedAt = DateTime.UtcNow,
        DueDate = request.DueDate
      };

      DbContext.UserTasks.Add(task);
      DbContext.SaveChanges();

      return task;
    }

    public UserTask UpdateTask(Guid id, UpdateTaskRequest request)
    {
        var task = DbContext.UserTasks
            .FirstOrDefault(t => t.Id == id);

        if (task == null)
            throw new ArgumentException($"Task with id {id} not found");

        if (!string.IsNullOrWhiteSpace(request.Name))
            task.Name = request.Name;

        if (!string.IsNullOrWhiteSpace(request.Description))
            task.Description = request.Description;

        if (request.Status.HasValue)
            task.Status = request.Status.Value;

        if (request.AssigneeId.HasValue)
        {
            var userExists = DbContext.Users
                .Any(u => u.Id == request.AssigneeId.Value);

            if (!userExists)
                throw new ArgumentException("Assignee not found");

            task.AssigneeId = request.AssigneeId;
        }

        if (request.DueDate.HasValue)
            task.DueDate = request.DueDate;

        task.UpdatedAt = DateTime.UtcNow;

        DbContext.SaveChanges();

        return task;
    }

    public void DeleteTask(Guid id)
    {
      var task = DbContext.UserTasks
        .FirstOrDefault(t => t.Id == id);

      if (task == null)
        throw new ArgumentException($"Task with id {id} not found");

      DbContext.UserTasks.Remove(task);
      DbContext.SaveChanges();
    }
}
