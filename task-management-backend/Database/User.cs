namespace task_management_backend.Database;

public class User
{
    public Guid ID { get; set; }
    public string Username { get; set; }
    public string PasswordHashed { get; set; }
    public string Email { get; set; }
}