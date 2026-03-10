using task_management_backend.Enums;
using task_management_backend.Helpers;
using Xunit;

namespace task_management_backend.Tests;

public class TaskStateMachineTests
{
  [Theory]
  [InlineData(UserTaskStatus.ToDo, UserTaskStatus.InProgress, true)]
  [InlineData(UserTaskStatus.InProgress, UserTaskStatus.Review, true)]
  [InlineData(UserTaskStatus.Review, UserTaskStatus.Done, true)]
  [InlineData(UserTaskStatus.InProgress, UserTaskStatus.ToDo, true)]

  [InlineData(UserTaskStatus.ToDo, UserTaskStatus.Done, false)]
  [InlineData(UserTaskStatus.Done, UserTaskStatus.InProgress, false)]
  [InlineData(UserTaskStatus.Done, UserTaskStatus.ToDo, false)]
  public void CanTransition_ReturnsExpectedResult(
    UserTaskStatus current,
    UserTaskStatus next,
    bool expected)
  {
    var result = TaskStateMachine.CanTransition(current, next);

    Assert.Equal(expected, result);
  }
}
