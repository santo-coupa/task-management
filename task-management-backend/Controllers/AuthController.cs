using Microsoft.AspNetCore.Mvc;
using task_management_backend.Dto.Auth;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
  private readonly IAuthService AuthService;

  public AuthController(IAuthService authService)
  {
    AuthService = authService;
  }

  [HttpPost("authenticate")]
  public ActionResult<AuthenticateResponse> Authenticate(
    [FromBody] AuthenticateRequest request)
  {
    var response = AuthService.Authenticate(request);
    return Ok(response);
  }
}
