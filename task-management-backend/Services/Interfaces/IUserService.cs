using task_management_backend.Database;
using task_management_backend.Dto;

namespace task_management_backend.Services.Interfaces;

public interface IUserService
{
  IEnumerable<User> GetUsers();
  User CreateUser(CreateUserRequest request);
}
