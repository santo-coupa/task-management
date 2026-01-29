namespace task_management_backend.Database;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string PasswordHashed { get; set; }
    public string Email { get; set; }
    public List<UserTask> Tasks { get; set; } = new();
}
