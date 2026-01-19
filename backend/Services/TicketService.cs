using ProjectBoard.Api.DTOs;
using ProjectBoard.Api.Models;
using ProjectBoard.Api.Repositories;

namespace ProjectBoard.Api.Services
{
    public interface ITicketService
    {
        Task<IEnumerable<TicketDto>> GetAllTicketsAsync();
        Task<TicketDto?> GetTicketByIdAsync(int id);
        Task<TicketDto> CreateTicketAsync(CreateTicketDto createDto);
        Task<TicketDto?> UpdateTicketAsync(int id, UpdateTicketDto updateDto);
        Task<TicketDto?> UpdateTicketStatusAsync(int id, UpdateTicketStatusDto statusDto);
        Task<bool> DeleteTicketAsync(int id);
    }

    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _repository;

        public TicketService(ITicketRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TicketDto>> GetAllTicketsAsync()
        {
            var tickets = await _repository.GetAllAsync();
            return tickets.Select(MapToDto);
        }

        public async Task<TicketDto?> GetTicketByIdAsync(int id)
        {
            var ticket = await _repository.GetByIdAsync(id);
            return ticket == null ? null : MapToDto(ticket);
        }

        public async Task<TicketDto> CreateTicketAsync(CreateTicketDto createDto)
        {
            var ticket = new Ticket
            {
                Name = createDto.Name,
                Description = createDto.Description,
                Category = createDto.Category,
                Status = createDto.Status,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(ticket);
            return MapToDto(created);
        }

        public async Task<TicketDto?> UpdateTicketAsync(int id, UpdateTicketDto updateDto)
        {
            if (!await _repository.ExistsAsync(id))
                return null;

            var ticket = new Ticket
            {
                Id = id,
                Name = updateDto.Name,
                Description = updateDto.Description,
                Category = updateDto.Category,
                Status = updateDto.Status
            };

            var updated = await _repository.UpdateAsync(ticket);
            return updated == null ? null : MapToDto(updated);
        }

        public async Task<TicketDto?> UpdateTicketStatusAsync(int id, UpdateTicketStatusDto statusDto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null)
                return null;

            existing.Status = statusDto.Status;
            var updated = await _repository.UpdateAsync(existing);
            return updated == null ? null : MapToDto(updated);
        }

        public async Task<bool> DeleteTicketAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        private static TicketDto MapToDto(Ticket ticket)
        {
            return new TicketDto
            {
                Id = ticket.Id,
                Name = ticket.Name,
                Description = ticket.Description,
                Category = ticket.Category,
                Status = ticket.Status,
                CreatedAt = ticket.CreatedAt
            };
        }
    }
}