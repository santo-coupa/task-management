using Mapster;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Attributes;
using task_management_backend.Dto.Tasks;
using task_management_backend.Services.Interfaces;
using System.Security.Claims;

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
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userIdClaim == null)
      throw new UnauthorizedAccessException();

    var currentUserId = Guid.Parse(userIdClaim);

    var task = TaskService.CreateTask(request, currentUserId);

    return Ok(task.Adapt<GetTaskResponse>());
  }

  [HttpPatch("{id:guid}", Name = "UpdateTask")]
  public ActionResult<GetTaskResponse> Update(
    [FromRoute] Guid id,
    [FromBody] UpdateTaskRequest request)
  {
    var task = TaskService.UpdateTask(id, request);
    return task.Adapt<GetTaskResponse>();
  }

  [HttpDelete("{id:guid}", Name = "DeleteTask")]
  public IActionResult Delete(Guid id)
  {
    TaskService.DeleteTask(id);
    return NoContent();
  }
}
