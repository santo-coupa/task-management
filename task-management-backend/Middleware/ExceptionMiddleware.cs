using System.Net;
using System.Text.Json;

namespace task_management_backend.Middleware;

public class ExceptionMiddleware
{
  private readonly RequestDelegate _next;

  public ExceptionMiddleware(RequestDelegate next)
  {
    _next = next;
  }

  public async Task InvokeAsync(HttpContext context)
  {
    try
    {
      await _next(context);
    }
    catch (UnauthorizedAccessException ex)
    {
      context.Response.StatusCode = StatusCodes.Status401Unauthorized;
      context.Response.ContentType = "application/json";

      var response = new
      {
        error = "Unauthorized",
        message = ex.Message
      };

      await context.Response.WriteAsync(
        JsonSerializer.Serialize(response)
      );
    }
    catch (ArgumentException ex)
    {
      context.Response.StatusCode = StatusCodes.Status400BadRequest;
      await context.Response.WriteAsync(ex.Message);
    }
    catch (Exception)
    {
      context.Response.StatusCode = StatusCodes.Status500InternalServerError;
      await context.Response.WriteAsync("Internal server error");
    }
  }
}
