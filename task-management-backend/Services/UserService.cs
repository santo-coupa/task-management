using task_management_backend.Database;
using task_management_backend.Dto;
using task_management_backend.Dto.Users;
using task_management_backend.Enums;
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
      PasswordHashed = BCrypt.Net.BCrypt.HashPassword(request.Password),

      FirstName = request.FirstName,
      LastName = request.LastName,
      Title = request.Title,

      Role = request.Role ?? UserRole.User,
      IsActive = request.IsActive ?? true,

      CreatedAt = DateTime.UtcNow
    };


    DbContext.Users.Add(user);
    DbContext.SaveChanges();

    return user;
  }

  public User UpdateUser(Guid id, UpdateUserRequest request)
  {
    var user = DbContext.Users
      .FirstOrDefault(u => u.Id == id);

    if (user == null)
      throw new ArgumentException($"User with id {id} not found");

    if (!string.IsNullOrWhiteSpace(request.Username))
      user.Username = request.Username;

    if (!string.IsNullOrWhiteSpace(request.FirstName))
      user.FirstName = request.FirstName;

    if (!string.IsNullOrWhiteSpace(request.LastName))
      user.LastName = request.LastName;

    if (!string.IsNullOrWhiteSpace(request.Email))
      user.Email = request.Email;

    if (!string.IsNullOrWhiteSpace(request.Title))
      user.Title = request.Title;

    if (request.IsActive.HasValue)
      user.IsActive = request.IsActive.Value;

    if (!string.IsNullOrWhiteSpace(request.Password))
      user.PasswordHashed = BCrypt.Net.BCrypt.HashPassword(request.Password);

    user.UpdatedAt = DateTime.UtcNow;

    DbContext.SaveChanges();

    return user;
  }

  public void DeleteUser(Guid id)
  {
    var user = DbContext.Users
      .FirstOrDefault(u => u.Id == id);

    if (user == null)
      throw new ArgumentException($"User with id {id} not found");

    DbContext.Users.Remove(user);
    DbContext.SaveChanges();
  }

}
