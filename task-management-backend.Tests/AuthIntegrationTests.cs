using System.Net;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using task_management_backend;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;
using Xunit;

public class AuthIntegrationTests
{
  private readonly HttpClient _client;
  private readonly ApplicationDbContext _context;

  public AuthIntegrationTests()
  {
    var factory = new CustomWebApplicationFactory();
    _client = factory.CreateClient();

    var scope = factory.Services.CreateScope();
    _context = scope.ServiceProvider
      .GetRequiredService<ApplicationDbContext>();

    _context.Database.EnsureCreated();
  }

  private async Task SeedUser(string username, string password)
  {
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = username,
      Email = $"{username}@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword(password),
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();
  }

  [Fact]
  public async Task Login_WithValidCredentials_ReturnsToken()
  {
    // Arrange
    await SeedUser("testuser", "password123");

    var loginRequest = new AuthenticateRequest
    {
      Username = "testuser",
      Password = "password123"
    };

    // Act
    var response = await _client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    // Assert
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var result = await response.Content
      .ReadFromJsonAsync<AuthenticateResponse>();

    Assert.NotNull(result);
    Assert.False(string.IsNullOrEmpty(result!.Token));
  }

  [Fact]
  public async Task Login_WithWrongPassword_ReturnsBadRequest()
  {
    // Arrange
    await SeedUser("testuser", "password123");

    var loginRequest = new AuthenticateRequest
    {
      Username = "testuser",
      Password = "wrongpassword"
    };

    // Act
    var response = await _client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    // Assert
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Login_WithUnknownUser_ReturnsBadRequest()
  {
    // Arrange
    var loginRequest = new AuthenticateRequest
    {
      Username = "unknownuser",
      Password = "password123"
    };

    // Act
    var response = await _client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    // Assert
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }
}
