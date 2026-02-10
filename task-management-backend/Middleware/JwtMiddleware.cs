using task_management_backend.Attributes;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Middleware;

public class JwtMiddleware
{
  private readonly RequestDelegate _next;

  public JwtMiddleware(RequestDelegate next)
  {
    _next = next;
  }

  public async Task InvokeAsync(
    HttpContext context,
    IAuthService authService)
  {
    var endpoint = context.GetEndpoint();

    if (endpoint == null)
    {
      await _next(context);
      return;
    }

    var allowAnonymous =
      endpoint.Metadata.GetMetadata<AllowAnonymousAttribute>();

    if (allowAnonymous != null)
    {
      await _next(context);
      return;
    }

    var token = GetBearerToken(context);

    if (token == null)
    {
      throw new UnauthorizedAccessException("Missing JWT token");
    }

    authService.ValidateToken(token);

    await _next(context);
  }

  private static string? GetBearerToken(HttpContext context)
  {
    var authorizationHeader = context.Request.Headers["Authorization"].ToString();

    if (string.IsNullOrWhiteSpace(authorizationHeader))
      return null;

    const string bearerPrefix = "Bearer ";

    if (!authorizationHeader.StartsWith(bearerPrefix, StringComparison.OrdinalIgnoreCase))
      return null;

    return authorizationHeader[bearerPrefix.Length..].Trim();
  }
}
