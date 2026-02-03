using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using task_management_backend.Database;
using task_management_backend.Dto.Auth;

namespace task_management_backend.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext DbContext;
    private readonly IConfiguration Configuration;

    public AuthController(
        ApplicationDbContext dbContext,
        IConfiguration configuration)
    {
        DbContext = dbContext;
        Configuration = configuration;
    }

    [HttpPost("authenticate")]
    public ActionResult<AuthenticateResponse> Authenticate(
        [FromBody] AuthenticateRequest request)
    {
        // Find user by username
        var user = DbContext.Users
            .FirstOrDefault(u => u.Username == request.Username);

        if (user == null)
        {
            return NotFound("User not found");
        }

        // Verify password using BCrypt
        var passwordValid = BCrypt.Net.BCrypt.Verify(
            request.Password,
            user.PasswordHashed
        );

        if (!passwordValid)
        {
            return BadRequest("Invalid password");
        }

        // Create identity claims
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email)
        };

        // Create signing key from secret
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]!)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        // Create JWT token
        var token = new JwtSecurityToken(
            issuer: Configuration["Jwt:Issuer"],
            audience: Configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(Configuration["Jwt:ExpiresInMinutes"]!)
            ),
            signingCredentials: credentials
        );

        // Serialize token to string
        var tokenString = new JwtSecurityTokenHandler()
            .WriteToken(token);

        // Return authentication response
        return Ok(new AuthenticateResponse
        {
            Token = tokenString,
            Username = user.Username,
            Email = user.Email
        });
    }
}
