using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;
using task_management_backend.Services.Interfaces;

namespace task_management_backend.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext DbContext;
    private readonly IConfiguration Configuration;

    public AuthService(
        ApplicationDbContext dbContext,
        IConfiguration configuration)
    {
        DbContext = dbContext;
        Configuration = configuration;
    }

    public AuthenticateResponse Authenticate(AuthenticateRequest request)
    {
        var user = DbContext.Users
            .FirstOrDefault(u => u.Username == request.Username);

        if (user == null)
        {
            throw new ArgumentException("User not found");
        }

        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHashed
        );

        if (!passwordValid)
        {
            throw new ArgumentException("Invalid password");
        }

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: Configuration["Jwt:Issuer"],
            audience: Configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(Configuration["Jwt:ExpiresInMinutes"]!)
            ),
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler()
            .WriteToken(token);

        return new AuthenticateResponse
        {
            Token = tokenString,
            Username = user.Username,
            Email = user.Email
        };
    }

    public void ValidateToken(string token)
    {
      try
      {
        var key = new SymmetricSecurityKey(
          Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!)
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = key,
          ValidateIssuer = false,
          ValidateAudience = false,
          ClockSkew = TimeSpan.Zero,
        }, out _);
      }
      catch
      {
        throw new UnauthorizedAccessException("Invalid or malformed JWT token");
      }
    }
}
