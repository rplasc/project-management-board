using System.ComponentModel.DataAnnotations;

namespace ProjectBoard.Api.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        public TicketCategory Category { get; set; }

        [Required]
        public TicketStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum TicketCategory
    {
        Feature = 0,
        Bug = 1,
        RAndD = 2
    }

    public enum TicketStatus
    {
        Backlog = 0,
        InProgress = 1,
        Review = 2,
        Done = 3
    }
}