using Mapster;
using Microsoft.EntityFrameworkCore;
using task_management_backend;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =======================
// 1. ADD SERVICES
// =======================

// Controllers
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
  options.UseNpgsql(
    builder.Configuration.GetConnectionString("DefaultConnection")
  )
);

// Mapster
builder.Services.AddMapster();

// Swagger / OpenAPI
builder.Services.AddOpenApi();

// =======================
// 2. JWT AUTHENTICATION
// =======================

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"];

builder.Services
  .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidateIssuerSigningKey = true,

      ValidIssuer = jwtSection["Issuer"],
      ValidAudience = jwtSection["Audience"],

      IssuerSigningKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwtKey!)
      )
    };
  });

// =======================
// 3. BUILD APP
// =======================

var app = builder.Build();

// =======================
// 4. MIDDLEWARE PIPELINE
// =======================

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();

// 🔑 AUTHENTICATION MUST COME BEFORE AUTHORIZATION
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
