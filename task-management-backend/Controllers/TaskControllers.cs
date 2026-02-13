using Mapster;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Attributes;
using task_management_backend.Dto.Tasks;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
  private readonly ITaskService TaskService;

  public TasksController(ITaskService taskService)
  {
    TaskService = taskService;
  }

  [HttpGet(Name = "GetTasks")]
  public IEnumerable<GetTaskResponse> Get()
  {
    var tasks = TaskService.GetTasks();
    return tasks.Adapt<GetTaskResponse[]>();
  }

  [HttpPost(Name = "CreateTask")]
  public ActionResult<GetTaskResponse> Create([FromBody] CreateTaskRequest request)
  {
    var task = TaskService.CreateTask(request);
    return task.Adapt<GetTaskResponse>();
  }

  [HttpPatch("{id:guid}", Name = "UpdateTask")]
  public ActionResult<GetTaskResponse> Update(
    [FromRoute] Guid id,
    [FromBody] UpdateTaskRequest request)
  {
    var task = TaskService.UpdateTask(id, request);
    return task.Adapt<GetTaskResponse>();
  }
}
