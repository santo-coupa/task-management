using Mapster;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Attributes;
using task_management_backend.Dto;
using task_management_backend.Dto.Users;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
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
    var user = UserService.CreateUser(request);
    return user.Adapt<GetUserResponse>();
  }

  [HttpPatch("{id:guid}", Name = "UpdateUser")]
  public ActionResult<GetUserResponse> Update(
    Guid id,
    [FromBody] UpdateUserRequest request)
  {
    var user = UserService.UpdateUser(id, request);
    return Ok(user.Adapt<GetUserResponse>());
  }

  [CanOnlyBePerformedByAdmin]
  [HttpDelete("{id:guid}", Name = "DeleteUser")]
  public IActionResult Delete(Guid id)
  {
    UserService.DeleteUser(id);
    return NoContent();
  }
}
