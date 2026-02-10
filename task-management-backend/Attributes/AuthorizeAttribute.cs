using Microsoft.AspNetCore.Mvc.Filters;

namespace task_management_backend.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAsyncAuthorizationFilter
{
  public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
  {
    var metadata = context.ActionDescriptor.EndpointMetadata;
    var allowAnonymous = metadata.OfType<AllowAnonymousAttribute>().Any();
    if (allowAnonymous)
      return;
  }
}
