using task_management_backend.Dto.Profile;

namespace task_management_backend.Services.Interfaces;

public interface IProfileService
{
  GetProfileResponse GetProfiles(Guid userId);
  GetProfileResponse UpdateProfile(Guid userId, UpdateProfileRequest request);
  void ChangePassword(Guid userId, ChangePasswordRequest request);
}
