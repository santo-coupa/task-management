namespace task_management_backend.Tests;

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;
using task_management_backend.Dto.Users;
using task_management_backend.Enums;
using Xunit;

public class UsersIntegrationTests
{
  private readonly HttpClient _client;
  private readonly ApplicationDbContext _context;

  public UsersIntegrationTests()
  {
    var factory = new CustomWebApplicationFactory();
    _client = factory.CreateClient();

    var scope = factory.Services.CreateScope();
    _context = scope.ServiceProvider
      .GetRequiredService<ApplicationDbContext>();

    _context.Database.EnsureCreated();
  }

  private async Task<string> LoginAndGetToken()
  {
    var admin = new User
    {
      Id = Guid.NewGuid(),
      Username = "adminuser",
      Email = "admin@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      Role = UserRole.Admin,
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(admin);
    await _context.SaveChangesAsync();

    var loginRequest = new AuthenticateRequest
    {
      Username = "adminuser",
      Password = "password123"
    };

    var response = await _client.PostAsJsonAsync("/auth/authenticate", loginRequest);
    var result = await response.Content.ReadFromJsonAsync<AuthenticateResponse>();

    return result!.Token;
  }

  private void AttachToken(string token)
  {
    _client.DefaultRequestHeaders.Authorization =
      new AuthenticationHeaderValue("Bearer", token);
  }

  [Fact]
  public async Task GetUsers_ReturnsUsers()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var response = await _client.GetAsync("/users");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task CreateUser_CreatesUser()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var request = new CreateUserRequest
    {
      Username = "testuser",
      Email = "test@test.com",
      Password = "password123"
    };

    var response = await _client.PostAsJsonAsync("/users", request);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var user = _context.Users.FirstOrDefault(u => u.Username == "testuser");

    Assert.NotNull(user);
    Assert.Equal(request.Email, user!.Email);
  }

  [Fact]
  public async Task UpdateUser_UpdatesUser()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "olduser",
      Email = "old@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var updateRequest = new UpdateUserRequest
    {
      FirstName = "Santosh",
      LastName = "Yadav"
    };

    var response = await _client.PatchAsJsonAsync(
      $"/users/{user.Id}",
      updateRequest);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    _context.ChangeTracker.Clear();

    var updated = await _context.Users.FindAsync(user.Id);

    Assert.Equal("Santosh", updated!.FirstName);
    Assert.Equal("Yadav", updated.LastName);
  }

  [Fact]
  public async Task DeleteUser_DeletesUser()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "deleteuser",
      Email = "delete@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var response = await _client.DeleteAsync($"/users/{user.Id}");

    Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

    _context.ChangeTracker.Clear();

    var deleted = await _context.Users.FindAsync(user.Id);

    Assert.Null(deleted);
  }
}
