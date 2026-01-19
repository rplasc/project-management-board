using System.ComponentModel.DataAnnotations;
using ProjectBoard.Api.Models;

namespace ProjectBoard.Api.DTOs
{
    // For creating new tickets
    public class CreateTicketDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public TicketCategory Category { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public TicketStatus Status { get; set; }
    }

    // For updating existing tickets
    public class UpdateTicketDto
    {
        [Required(ErrorMessage = "Name is required")]
        [MaxLength(200, ErrorMessage = "Name cannot exceed 200 characters")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Category is required")]
        public TicketCategory Category { get; set; }

        [Required(ErrorMessage = "Status is required")]
        public TicketStatus Status { get; set; }
    }

    // For PATCH requests to update just the status (drag-and-drop feature)
    public class UpdateTicketStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        public TicketStatus Status { get; set; }
    }

    // For returning ticket data to clients
    public class TicketDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public TicketCategory Category { get; set; }
        public TicketStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}