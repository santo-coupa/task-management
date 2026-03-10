using task_management_backend.Enums;

namespace task_management_backend.Helpers;

public static class TaskStateMachine
{
  public static bool CanTransition(UserTaskStatus current, UserTaskStatus next)
  {
    return current switch
    {
      UserTaskStatus.ToDo => next == UserTaskStatus.InProgress,

      UserTaskStatus.InProgress =>
        next == UserTaskStatus.ToDo ||
        next == UserTaskStatus.Review,

      UserTaskStatus.Review =>
        next == UserTaskStatus.Done ||
        next == UserTaskStatus.ToDo ||
        next == UserTaskStatus.InProgress,

      UserTaskStatus.Done => false,

      _ => false
    };
  }
}
