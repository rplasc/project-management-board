using Microsoft.EntityFrameworkCore;
using ProjectBoard.Api.Models;

namespace ProjectBoard.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Ticket> Tickets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Ticket>()
                .Property(t => t.Category)
                .HasConversion<string>();

            modelBuilder.Entity<Ticket>()
                .Property(t => t.Status)
                .HasConversion<string>();

            // Added index on Status for faster queries when loading board
            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.Status);

            // Seeded some tickets for testing
            modelBuilder.Entity<Ticket>().HasData(
                new Ticket
                {
                    Id = 1,
                    Name = "Setup CI/CD Pipeline",
                    Description = "Configure automated deployment",
                    Category = TicketCategory.Feature,
                    Status = TicketStatus.Backlog,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Ticket
                {
                    Id = 2,
                    Name = "Fix edit bug",
                    Description = "Ticket modal form is empty when attempting to edit existing tickets",
                    Category = TicketCategory.Bug,
                    Status = TicketStatus.Done,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Ticket
                {
                    Id = 3,
                    Name = "Researching Angular/.NET stack",
                    Description = "Evaluating how to connect Angular frontend to .NET backend.",
                    Category = TicketCategory.RAndD,
                    Status = TicketStatus.Review,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                }
            );
        }
    }
}