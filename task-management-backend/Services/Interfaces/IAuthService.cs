using System.Security.Claims;
using task_management_backend.Dto.Auth;
namespace task_management_backend.Services.Interfaces;

public interface IAuthService
{
  AuthenticateResponse Authenticate(AuthenticateRequest request);
  ClaimsPrincipal ValidateToken(string token);
}
