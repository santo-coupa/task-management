using task_management_backend.Enums;

namespace task_management_backend.Database;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHashed { get; set; } = string.Empty;
    public string Email { get; set; }  = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public List<UserTask> Tasks { get; set; } = new();
}
