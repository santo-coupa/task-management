using Mapster;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using task_management_backend.Database;
using task_management_backend.Dto;

namespace task_management_backend.Controllers;

[ApiController]
[Route("[controller]")]

public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext DbContext;

    public UsersController(ApplicationDbContext dbContext)
    {
      DbContext = dbContext;
    }
    [HttpGet(Name = "GetUsers")]
    public IEnumerable<GetUserResponse> Get()
    {
      return DbContext.Users.ToList().Adapt<GetUserResponse[]>();
    }

    [HttpPost(Name = "CreateUser")]
    public ActionResult<GetUserResponse> Create([FromBody] CreateUserRequest request)
    {
      var emailExists = DbContext.Users.Any(u => u.Email == request.Email);

      if (emailExists)
      {
        return BadRequest("Email already exists");
      }

      var user = new User
      {
        ID = Guid.CreateVersion7(),
        Username = request.Username,
        PasswordHashed = BCrypt.Net.BCrypt.HashPassword(request.Password),
        Email = request.Email,
        };

        DbContext.Users.Add(user);
        DbContext.SaveChanges();
        return user.Adapt<GetUserResponse>();
    }
}
