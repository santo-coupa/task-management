using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Attributes;
using task_management_backend.Database;
using task_management_backend.Dto.Profile;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
  private readonly IProfileService ProfileService;
  public ProfileController(IProfileService profileService)
  {
    ProfileService = profileService;
  }

  [HttpGet]
  public ActionResult<GetProfileResponse> GetProfile()
  {
    var userId = GetUseridFromClaims();

    var profile = ProfileService.GetProfiles(userId);
    return Ok(profile);
  }

  [HttpPatch]
  public ActionResult<GetProfileResponse> UpdateProfile(
    [FromBody] UpdateProfileRequest request)
  {
    var userId = GetUseridFromClaims();

    var profile = ProfileService.UpdateProfile(userId, request);
    return Ok(profile);
  }

  private Guid GetUseridFromClaims()
  {
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (userIdClaim == null)
      throw new UnauthorizedAccessException();

    return Guid.Parse(userIdClaim);
  }
}
