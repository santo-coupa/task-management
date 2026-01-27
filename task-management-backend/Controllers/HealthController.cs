using Microsoft.AspNetCore.Mvc;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
  [HttpGet]
  public IActionResult Get()
  {
    return Ok("Healthy");
  }

}
