using Microsoft.EntityFrameworkCore;
using task_management_backend.Database;

namespace task_management_backend;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
}