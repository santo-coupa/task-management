namespace task_management_backend.Middleware;
using System.Net;
using System.Text.Json;

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
    catch (ArgumentException ex)
    {
      await HandleException(context, HttpStatusCode.BadRequest, ex.Message);
    }
    catch (Exception ex)
    {
      await HandleException(context, HttpStatusCode.InternalServerError, "An unexpected error occured");
    }
  }

  private static async Task HandleException(HttpContext context, HttpStatusCode statusCode, string errorMessage)
  {
    context.Response.ContentType = "application/json";
    context.Response.StatusCode = (int)statusCode;

    var response = new
    {
      error = errorMessage
    };
    await context.Response.WriteAsync(JsonSerializer.Serialize(response));
  }
}
