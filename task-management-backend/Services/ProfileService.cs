using task_management_backend.Database;
using task_management_backend.Dto.Profile;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Services;

public class ProfileService : IProfileService
{
  private readonly ApplicationDbContext DbContext;

  public ProfileService(ApplicationDbContext dbContext)
  {
    DbContext = dbContext;
  }

  public GetProfileResponse GetProfiles(Guid userId)
  {
    var user = DbContext.Users
      .FirstOrDefault(u => u.Id == userId);

    if(user == null)
      throw new ArgumentException("User not found");

    return MaptoGetProfileResponse(user);
  }

  public GetProfileResponse UpdateProfile(Guid userId, UpdateProfileRequest request)
  {
    var user = DbContext.Users
      .FirstOrDefault(u => u.Id == userId);

    if(user == null)
      throw new ArgumentException("User not found");

    if(request.FirstName != user.FirstName)
      user.FirstName = request.FirstName;

    if(request.LastName != user.LastName)
      user.LastName = request.LastName;

    if(request.Email != user.Email)
      user.Email = request.Email;

    if(request.Title != user.Title)
      user.Title = request.Title;

    if(!string.IsNullOrWhiteSpace(request.Password))
    {
      if(request.Password != request.ConfirmPassword)
        throw new ArgumentException("Passwords do not match");
      user.PasswordHashed = BCrypt.Net.BCrypt.HashPassword(request.Password);
    }

    user.UpdatedAt = DateTime.Now;
    DbContext.SaveChanges();
    return MaptoGetProfileResponse(user);
  }

  private static GetProfileResponse MaptoGetProfileResponse(User user)
  {
    return new GetProfileResponse
    {
      Id = user.Id,
      Username = user.Username,
      Email = user.Email,
      Role = user.Role,
      FirstName = user.FirstName,
      LastName = user.LastName,
      Title = user.Title,
      CreatedAt = user.CreatedAt,
      UpdatedAt = user.UpdatedAt
    };
  }
}
