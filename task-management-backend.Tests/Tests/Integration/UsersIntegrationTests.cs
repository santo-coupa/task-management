using task_management_backend.Tests.Tests;

namespace task_management_backend.Tests;

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using task_management_backend.Database;
using task_management_backend.Dto.Users;
using task_management_backend.Enums;
using Xunit;

public class UsersIntegrationTests : IntegrationTestBase
{
  [Fact]
  public async Task GetUsers_ReturnsUsers()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var response = await Client.GetAsync("/users");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task CreateUser_CreatesUser()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var request = new CreateUserRequest
    {
      Username = "testuser",
      Email = "test@test.com",
      Password = "password123"
    };

    var response = await Client.PostAsJsonAsync("/users", request);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Context.ChangeTracker.Clear();

    var user = Context.Users.FirstOrDefault(u => u.Username == "testuser");

    Assert.NotNull(user);
    Assert.Equal(request.Email, user!.Email);
  }

  [Fact]
  public async Task UpdateUser_UpdatesUser()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var user = await SeedUser("olduser");

    var updateRequest = new UpdateUserRequest
    {
      FirstName = "Santosh",
      LastName = "Yadav"
    };

    var response = await Client.PatchAsJsonAsync(
      $"/users/{user.Id}",
      updateRequest);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Context.ChangeTracker.Clear();

    var updated = await Context.Users.FindAsync(user.Id);

    Assert.Equal("Santosh", updated!.FirstName);
    Assert.Equal("Yadav", updated.LastName);
  }

  [Fact]
  public async Task DeleteUser_DeletesUser()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var user = await SeedUser("deleteuser");

    var response = await Client.DeleteAsync($"/users/{user.Id}");

    Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

    Context.ChangeTracker.Clear();

    var deleted = await Context.Users.FindAsync(user.Id);

    Assert.Null(deleted);
  }

  [Fact]
  public async Task GetUsers_WithoutToken_ReturnsUnauthorized()
  {
    var response = await Client.GetAsync("/users");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task DeleteUser_UserDoesNotExist_ReturnsBadRequest()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var randomId = Guid.NewGuid();

    var response = await Client.DeleteAsync($"/users/{randomId}");

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task DeleteUser_NonAdmin_ReturnsForbidden()
  {
    var admin = new User
    {
      Id = Guid.NewGuid(),
      Username = "admin",
      Email = "admin@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password"),
      Role = UserRole.Admin,
      CreatedAt = DateTime.UtcNow
    };

    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "user",
      Email = "user@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password"),
      Role = UserRole.User,
      CreatedAt = DateTime.UtcNow
    };

    Context.Users.Add(admin);
    Context.Users.Add(user);
    await Context.SaveChangesAsync();

    var loginRequest = new
    {
      Username = "user",
      Password = "password"
    };

    var loginResponse = await Client.PostAsJsonAsync("/auth/authenticate", loginRequest);
    var result = await loginResponse.Content.ReadFromJsonAsync<dynamic>();

    Client.DefaultRequestHeaders.Authorization =
      new AuthenticationHeaderValue("Bearer", result.token.ToString());

    var response = await Client.DeleteAsync($"/users/{admin.Id}");

    Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
  }
}
