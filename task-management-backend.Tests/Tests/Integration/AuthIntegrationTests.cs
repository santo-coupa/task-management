using System.Net;
using System.Net.Http.Json;
using task_management_backend.Dto.Auth;
using task_management_backend.Tests.Tests;

public class AuthIntegrationTests : IntegrationTestBase
{
  [Fact]
  public async Task Login_WithValidCredentials_ReturnsToken()
  {
    await SeedUser("testuser");

    var loginRequest = new AuthenticateRequest
    {
      Username = "testuser",
      Password = "password123"
    };

    var response = await Client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Context.ChangeTracker.Clear();

    var result = await response.Content
      .ReadFromJsonAsync<AuthenticateResponse>();

    Assert.NotNull(result);
    Assert.False(string.IsNullOrEmpty(result!.Token));
  }

  [Fact]
  public async Task Login_WithWrongPassword_ReturnsBadRequest()
  {
    await SeedUser("testuser");

    var loginRequest = new AuthenticateRequest
    {
      Username = "testuser",
      Password = "wrongpassword"
    };

    var response = await Client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task Login_WithUnknownUser_ReturnsBadRequest()
  {
    var loginRequest = new AuthenticateRequest
    {
      Username = "unknownuser",
      Password = "password123"
    };

    var response = await Client.PostAsJsonAsync(
      "/auth/authenticate",
      loginRequest);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }
}
