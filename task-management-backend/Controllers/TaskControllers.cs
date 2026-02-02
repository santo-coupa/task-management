using Mapster;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Database;
using task_management_backend.Dto;
using task_management_backend.Dto.Tasks;
using task_management_backend.Enums;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class TasksController : ControllerBase
{
  private readonly ApplicationDbContext DbContext;

  public TasksController(ApplicationDbContext dbContext)
  {
    DbContext = dbContext;
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
    var userExists = DbContext.Users.Any(u => u.Id == request.AssignedUserId);

    if (!userExists)
    {
      return BadRequest("Assigned user does not exist");
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

    return task.Adapt<GetTaskResponse>();
  }
}
