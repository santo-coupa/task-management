using Mapster;
using Microsoft.EntityFrameworkCore;
using task_management_backend;
using task_management_backend.Middleware;
using task_management_backend.Services;
using task_management_backend.Services.Interfaces;
using task_management_backend.Database;
using task_management_backend.Enums;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowFrontend",
    policy =>
    {
      policy.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// Database
if (builder.Environment.EnvironmentName == "Testing")
{
  builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("TestDatabase"));
}
else
{
  builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
      builder.Configuration.GetConnectionString("DefaultConnection")
    ));
}

// Mapster
builder.Services.AddMapster();

// Services
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddHttpContextAccessor();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowFrontend");

// Middleware
app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<JwtMiddleware>();

if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();


//Prevent seeding during integration testing
if (!app.Environment.IsEnvironment("Testing"))
{
  using (var scope = app.Services.CreateScope())
  {
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
      var adminUser = new User
      {
        Id = Guid.CreateVersion7(),
        Username = "admin",
        Email = "admin@test.com",
        PasswordHashed = BCrypt.Net.BCrypt.HashPassword("admin123"),
        Role = UserRole.Admin
      };

      db.Users.Add(adminUser);
      db.SaveChanges();
    }
  }
}

app.Run();
