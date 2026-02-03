using Mapster;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Database;
using task_management_backend.Dto;
using task_management_backend.Dto.Tasks;
using task_management_backend.Enums;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase
{
  private readonly ApplicationDbContext DbContext;
  private readonly ITaskService TaskService;

  public TasksController(ApplicationDbContext dbContext, ITaskService taskService)
  {
    DbContext = dbContext;
    TaskService = taskService;
  }

  [HttpGet(Name = "GetTasks")]
  public IEnumerable<GetTaskResponse> Get()
  {
    return DbContext.UserTasks
      .ToList()
      .Adapt<GetTaskResponse[]>();
  }

  [HttpPost(Name = "CreateTask")]
  public ActionResult<GetTaskResponse> Create([FromBody] CreateTaskRequest request)
  {
    var task =TaskService.CreateTask(request);
    return task.Adapt<GetTaskResponse>();
  }

  [HttpPatch("{id:guid}", Name = "UpdateTask")]
  public ActionResult<GetTaskResponse> Update([FromRoute] Guid id, [FromBody] UpdateTaskRequest request)
  {
    var task =TaskService.UpdateTask(id,request);
    return task.Adapt<GetTaskResponse>();
  }
}
