using Microsoft.AspNetCore.Mvc;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;

namespace task_management_backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
  private readonly ApplicationDbContext DbContext;

  public AuthController(ApplicationDbContext dbContext)
  {
    DbContext = dbContext;
  }

  [HttpPost("authenticate")]
  public ActionResult<AuthenticateResponse> Authenticate(
    [FromBody] AuthenticateRequest request)
  {

    var user = DbContext.Users
      .FirstOrDefault(u => u.Username == request.Username);

    if (user == null)
    {
      return NotFound("User not found");
    }

    var passwordValid = BCrypt.Net.BCrypt.Verify(
      request.Password,
      user.PasswordHashed
    );

    if (!passwordValid)
    {
      return BadRequest("Invalid password");
    }

    return Ok(new AuthenticateResponse
    {
      Token = "JWT_WILL_BE_HERE",
      Username = user.Username,
      Email = user.Email
    });
  }
}
