using System.Security.Claims;
using task_management_backend.Attributes;
using task_management_backend.Exceptions;
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
        IAuthService authService,
        IUserService userService)
    {

        if (context.Request.Path.StartsWithSegments("/swagger"))
        {
          await _next(context);
          return;
        }
        var endpoint = context.GetEndpoint();

        var allowAnonymous = endpoint?.Metadata
            .GetMetadata<AllowAnonymousAttribute>();

        if (allowAnonymous != null)
        {
            await _next(context);
            return;
        }

        var token = GetBearerToken(context);

        if (token == null)
            throw new UnauthorizedAccessException();

        var principal = authService.ValidateToken(token);
        context.User = principal;

        var adminAttribute = endpoint?.Metadata
            .GetMetadata<CanOnlyBePerformedByAdminAttribute>();

        if (adminAttribute != null)
        {
            var userIdClaim = context.User
                .FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                throw new UnauthorizedAccessException();

            var userId = Guid.Parse(userIdClaim);

            var user = userService.GetUserById(userId);

            if (user.Role != Enums.UserRole.Admin)
                throw new ForbiddenAccessException();
        }

        await _next(context);
    }

    private static string? GetBearerToken(HttpContext context)
    {
        var authorizationHeader =
            context.Request.Headers["Authorization"].ToString();

        if (string.IsNullOrWhiteSpace(authorizationHeader))
            return null;

        const string bearerPrefix = "Bearer ";

        if (!authorizationHeader.StartsWith(
                bearerPrefix,
                StringComparison.OrdinalIgnoreCase))
            return null;

        return authorizationHeader[bearerPrefix.Length..].Trim();
    }
}
