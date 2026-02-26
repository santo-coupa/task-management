using task_management_backend.Database;
using task_management_backend.Dto.Tasks;

namespace task_management_backend.Services.Interfaces;

public interface ITaskService
{
  IEnumerable<UserTask> GetTasks();
  UserTask CreateTask(CreateTaskRequest request, Guid currentUserId);
  UserTask UpdateTask(Guid id, UpdateTaskRequest request);
  void DeleteTask(Guid id);
}
