using Mapster;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Dto;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UsersController : ControllerBase
{
  private readonly IUserService UserService;

  public UsersController(IUserService userService)
  {
    UserService = userService;
  }

  [HttpGet(Name = "GetUsers")]
  public IEnumerable<GetUserResponse> Get()
  {
    var users = UserService.GetUsers();
    return users.Adapt<GetUserResponse[]>();
  }

  [HttpPost(Name = "CreateUser")]
  public ActionResult<GetUserResponse> Create(
    [FromBody] CreateUserRequest request)
  {
    try
    {
      var user = UserService.CreateUser(request);
      return user.Adapt<GetUserResponse>();
    }
    catch (ArgumentException ex)
    {
      return BadRequest(ex.Message);
    }
  }
}
