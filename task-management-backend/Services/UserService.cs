using task_management_backend.Database;
using task_management_backend.Dto;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Services;

public class UserService : IUserService
{
  private readonly ApplicationDbContext DbContext;

  public UserService(ApplicationDbContext dbContext)
  {
    DbContext = dbContext;
  }

  public IEnumerable<User> GetUsers()
  {
    return DbContext.Users.ToList();
  }

  public User CreateUser(CreateUserRequest request)
  {
    var emailExists = DbContext.Users.Any(u => u.Email == request.Email);
    if (emailExists)
    {
      throw new ArgumentException("Email already exists");
    }

    var user = new User
    {
      Id = Guid.CreateVersion7(),
      Username = request.Username,
      Email = request.Email,
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword(request.Password)
    };

    DbContext.Users.Add(user);
    DbContext.SaveChanges();

    return user;
  }
}
