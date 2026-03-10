namespace task_management_backend.Tests.Tests;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;
using task_management_backend.Enums;

public abstract class IntegrationTestBase
{
  protected readonly HttpClient Client;
  protected readonly ApplicationDbContext Context;

  protected IntegrationTestBase()
  {
    var factory = new CustomWebApplicationFactory();
    Client = factory.CreateClient();

    var scope = factory.Services.CreateScope();
    Context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    Context.Database.EnsureCreated();
  }

  protected async Task<string> LoginAsAdmin()
  {
    var username = $"admin_{Guid.NewGuid()}";

    var admin = new User
    {
      Id = Guid.NewGuid(),
      Username = username,
      Email = $"{username}@example.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      Role = UserRole.Admin,
      CreatedAt = DateTime.UtcNow
    };

    Context.Users.Add(admin);
    await Context.SaveChangesAsync();

    var loginRequest = new AuthenticateRequest
    {
      Username = username,
      Password = "password123"
    };

    var response = await Client.PostAsJsonAsync("/auth/authenticate", loginRequest);
    var result = await response.Content.ReadFromJsonAsync<AuthenticateResponse>();

    return result!.Token;
  }

  protected void AttachToken(string token)
  {
    Client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
  }

  protected async Task<User> SeedUser(string username)
  {
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = username,
      Email = $"{username}@example.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      CreatedAt = DateTime.UtcNow
    };

    Context.Users.Add(user);
    await Context.SaveChangesAsync();
    return user;
  }
}
