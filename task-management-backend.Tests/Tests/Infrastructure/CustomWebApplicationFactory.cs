using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using task_management_backend;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
  private readonly string _dbName = Guid.NewGuid().ToString();

  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.UseEnvironment("Testing");

    builder.ConfigureServices(services =>
    {
      services.RemoveAll(typeof(DbContextOptions<ApplicationDbContext>));
      services.RemoveAll(typeof(ApplicationDbContext));

      services.AddDbContext<ApplicationDbContext>(options =>
      {
        options.UseInMemoryDatabase(_dbName);
      });
    });
  }
}
