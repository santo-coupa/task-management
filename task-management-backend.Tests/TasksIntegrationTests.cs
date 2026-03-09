namespace task_management_backend.Tests;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.Extensions.DependencyInjection;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;
using task_management_backend.Dto.Tasks;
using task_management_backend.Enums;
using Xunit;

public class TasksIntegrationTests
{
  private readonly HttpClient _client;
  private readonly ApplicationDbContext _context;

  public TasksIntegrationTests()
  {
    var factory = new CustomWebApplicationFactory();
    _client = factory.CreateClient();

    var scope = factory.Services.CreateScope();
    _context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    _context.Database.EnsureCreated();
  }

  private async Task<string> LoginAndGetToken()
  {
    var user = new User
    {
      Id = Guid.NewGuid(),
      Username = "taskuser",
      Email = "task@test.com",
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword("password123"),
      CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var loginRequest = new AuthenticateRequest
    {
      Username = "taskuser",
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
  public async Task GetTasks_ReturnsTasks()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var response = await _client.GetAsync("/tasks");
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task CreateTask_CreatesTask()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var request = new CreateTaskRequest
    {
      Name = "Integration Test",
      Description = "Testing CreateTaskRequest",
      Status = UserTaskStatus.InProgress
    };

    var response = await _client.PostAsJsonAsync("/tasks", request);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var tasks = _context.UserTasks.ToList();
    Assert.Single(tasks);
    Assert.Equal("Integration Test", tasks[0].Name);
    Assert.Equal("Testing CreateTaskRequest", tasks[0].Description);
    Assert.Equal(UserTaskStatus.InProgress, tasks[0].Status);
  }

  [Fact]
  public async Task UpdateTask_UpdatesTasks()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var task = new UserTask
    {
      Id = Guid.NewGuid(),
      Name = "Old Task",
      Description = "Testing UpdateTaskRequest",
      Status = UserTaskStatus.InProgress,
      CreatedAt = DateTime.UtcNow,
    };

    _context.UserTasks.Add(task);
    await _context.SaveChangesAsync();

    var updateRequest = new UpdateTaskRequest
    {
      Name = "Updated Test",
      Status = UserTaskStatus.Done
    };

    var response = await _client.PatchAsJsonAsync($"/tasks/{task.Id}", updateRequest);
    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    var updated = await _context.UserTasks.FindAsync(task.Id);
    Assert.Equal(updated.Name, task.Name);
    Assert.Equal(updated.Status, task.Status);
  }

  [Fact]
  public async Task DeleteTask_DeletesTask()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var task = new UserTask
    {
      Id = Guid.NewGuid(),
      Name = "Delete Task",
      Description = "Testing DeleteTaskRequest",
      Status = UserTaskStatus.InProgress,
      CreatedAt = DateTime.UtcNow,
    };

    _context.UserTasks.Add(task);
    await _context.SaveChangesAsync();

    var response = await _client.DeleteAsync($"/tasks/{task.Id}");
    Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

    _context.ChangeTracker.Clear();

    var deleted = await _context.UserTasks.FindAsync(task.Id);
    Assert.Null(deleted);
  }

  [Fact]
  public async Task GetTasks_WithoutToken_ReturnsUnauthorized()
  {
    var response = await _client.GetAsync("/tasks");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task GetTasks_WithInvalidToken_ReturnsUnauthorized()
  {
    _client.DefaultRequestHeaders.Authorization =
      new AuthenticationHeaderValue("Bearer", "invalidtoken");

    var response = await _client.GetAsync("/tasks");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task CreateTask_WithoutName_ReturnsBadRequest()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var request = new
    {
      Description = "Missing name"
    };

    var response = await _client.PostAsJsonAsync("/tasks", request);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task UpdateTask_TaskNotFound_ReturnsBadRequest()
  {
    var token = await LoginAndGetToken();
    AttachToken(token);

    var request = new UpdateTaskRequest
    {
      Name = "Updated"
    };

    var response = await _client.PatchAsJsonAsync(
      $"/tasks/{Guid.NewGuid()}",
      request);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }
}
