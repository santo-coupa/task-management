using task_management_backend.Database;
using task_management_backend.Dto;
using task_management_backend.Dto.Users;

namespace task_management_backend.Services.Interfaces;

public interface IUserService
{
  IEnumerable<User> GetUsers();
  User CreateUser(CreateUserRequest request);
  User UpdateUser(Guid id, UpdateUserRequest request);
  void DeleteUser(Guid id);
  User GetUserById(Guid id);
}
