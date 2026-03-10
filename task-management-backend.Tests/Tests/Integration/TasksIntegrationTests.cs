using task_management_backend.Tests.Tests;

namespace task_management_backend.Tests;

using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using task_management_backend.Database;
using task_management_backend.Dto.Tasks;
using task_management_backend.Enums;
using Xunit;

public class TasksIntegrationTests : IntegrationTestBase
{
  [Fact]
  public async Task GetTasks_ReturnsTasks()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var response = await Client.GetAsync("/tasks");

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);
  }

  [Fact]
  public async Task CreateTask_CreatesTask()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var request = new CreateTaskRequest
    {
      Name = "Integration Test",
      Description = "Testing CreateTaskRequest",
      Status = UserTaskStatus.InProgress
    };

    var response = await Client.PostAsJsonAsync("/tasks", request);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Context.ChangeTracker.Clear();

    var tasks = Context.UserTasks.ToList();

    Assert.Single(tasks);
    Assert.Equal("Integration Test", tasks[0].Name);
    Assert.Equal("Testing CreateTaskRequest", tasks[0].Description);
    Assert.Equal(UserTaskStatus.InProgress, tasks[0].Status);
  }

  [Fact]
  public async Task UpdateTask_UpdatesTasks()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var task = new UserTask
    {
      Id = Guid.NewGuid(),
      Name = "Old Task",
      Description = "Testing UpdateTaskRequest",
      Status = UserTaskStatus.InProgress,
      CreatedAt = DateTime.UtcNow,
    };

    Context.UserTasks.Add(task);
    await Context.SaveChangesAsync();

    var updateRequest = new UpdateTaskRequest
    {
      Name = "Updated Test",
      Status = UserTaskStatus.Done
    };

    var response = await Client.PatchAsJsonAsync($"/tasks/{task.Id}", updateRequest);

    Assert.Equal(HttpStatusCode.OK, response.StatusCode);

    Context.ChangeTracker.Clear();

    var updated = await Context.UserTasks.FindAsync(task.Id);

    Assert.Equal("Updated Test", updated!.Name);
    Assert.Equal(UserTaskStatus.Done, updated.Status);
  }

  [Fact]
  public async Task DeleteTask_DeletesTask()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var task = new UserTask
    {
      Id = Guid.NewGuid(),
      Name = "Delete Task",
      Description = "Testing DeleteTaskRequest",
      Status = UserTaskStatus.InProgress,
      CreatedAt = DateTime.UtcNow,
    };

    Context.UserTasks.Add(task);
    await Context.SaveChangesAsync();

    var response = await Client.DeleteAsync($"/tasks/{task.Id}");

    Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

    Context.ChangeTracker.Clear();

    var deleted = await Context.UserTasks.FindAsync(task.Id);

    Assert.Null(deleted);
  }

  [Fact]
  public async Task GetTasks_WithoutToken_ReturnsUnauthorized()
  {
    var response = await Client.GetAsync("/tasks");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task GetTasks_WithInvalidToken_ReturnsUnauthorized()
  {
    Client.DefaultRequestHeaders.Authorization =
      new AuthenticationHeaderValue("Bearer", "invalidtoken");

    var response = await Client.GetAsync("/tasks");

    Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
  }

  [Fact]
  public async Task CreateTask_WithoutName_ReturnsBadRequest()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var request = new
    {
      Description = "Missing name"
    };

    var response = await Client.PostAsJsonAsync("/tasks", request);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }

  [Fact]
  public async Task UpdateTask_TaskNotFound_ReturnsBadRequest()
  {
    var token = await LoginAsAdmin();
    AttachToken(token);

    var request = new UpdateTaskRequest
    {
      Name = "Updated"
    };

    var response = await Client.PatchAsJsonAsync(
      $"/tasks/{Guid.NewGuid()}",
      request);

    Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
  }
}
