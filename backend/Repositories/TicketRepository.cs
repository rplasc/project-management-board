using Microsoft.EntityFrameworkCore;
using ProjectBoard.Api.Data;
using ProjectBoard.Api.Models;

namespace ProjectBoard.Api.Repositories
{
    public interface ITicketRepository
    {
        Task<IEnumerable<Ticket>> GetAllAsync();
        Task<Ticket?> GetByIdAsync(int id);
        Task<Ticket> CreateAsync(Ticket ticket);
        Task<Ticket?> UpdateAsync(Ticket ticket);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

    public class TicketRepository : ITicketRepository
    {
        private readonly ApplicationDbContext _context;

        public TicketRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Ticket>> GetAllAsync()
        {
            return await _context.Tickets
                .OrderBy(t => t.Status)
                .ThenByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<Ticket?> GetByIdAsync(int id)
        {
            return await _context.Tickets.FindAsync(id);
        }

        public async Task<Ticket> CreateAsync(Ticket ticket)
        {
            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();
            return ticket;
        }

        public async Task<Ticket?> UpdateAsync(Ticket ticket)
        {
            var existing = await _context.Tickets.FindAsync(ticket.Id);
            if (existing == null)
                return null;

            _context.Entry(existing).CurrentValues.SetValues(ticket);
            existing.CreatedAt = (await _context.Tickets
                .AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == ticket.Id))?.CreatedAt ?? existing.CreatedAt;
            
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
                return false;

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Tickets.AnyAsync(t => t.Id == id);
        }
    }
}