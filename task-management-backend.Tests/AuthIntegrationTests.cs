using System.Net;
using System.Net.Http.Json;
using BCrypt.Net;
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

  [Fact]
  public async Task Login_WithValidCredentials_ReturnsToken()
  {
    // Arrange
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "testuser",
      Email = "test@example.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

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
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "testuser2",
      Email = "test2@example.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var loginRequest = new AuthenticateRequest
    {
      Username = "testuser2",
      Password = "password1234"
    };

    // Act
    var response = await _client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    // Assert
    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }
}
