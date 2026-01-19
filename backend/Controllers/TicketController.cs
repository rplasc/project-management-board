using Microsoft.AspNetCore.Mvc;
using ProjectBoard.Api.DTOs;
using ProjectBoard.Api.Services;

namespace ProjectBoard.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketsController : ControllerBase
    {
        private readonly ITicketService _ticketService;
        private readonly ILogger<TicketsController> _logger;

        public TicketsController(ITicketService ticketService, ILogger<TicketsController> logger)
        {
            _ticketService = ticketService;
            _logger = logger;
        }

        // GET: api/tickets
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TicketDto>>> GetAllTickets()
        {
            var tickets = await _ticketService.GetAllTicketsAsync();
            return Ok(tickets);
        }

        // GET: api/tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDto>> GetTicket(int id)
        {
            var ticket = await _ticketService.GetTicketByIdAsync(id);
            
            if (ticket == null)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return Ok(ticket);
        }

        // POST: api/tickets
        [HttpPost]
        public async Task<ActionResult<TicketDto>> CreateTicket([FromBody] CreateTicketDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _ticketService.CreateTicketAsync(createDto);
            return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
        }

        // PUT: api/tickets/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TicketDto>> UpdateTicket(int id, [FromBody] UpdateTicketDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _ticketService.UpdateTicketAsync(id, updateDto);

            if (ticket == null)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return Ok(ticket);
        }

        // PATCH: api/tickets/5/status
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<TicketDto>> UpdateTicketStatus(int id, [FromBody] UpdateTicketStatusDto statusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var ticket = await _ticketService.UpdateTicketStatusAsync(id, statusDto);

            if (ticket == null)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return Ok(ticket);
        }

        // DELETE: api/tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var deleted = await _ticketService.DeleteTicketAsync(id);

            if (!deleted)
            {
                return NotFound(new { message = $"Ticket with ID {id} not found" });
            }

            return NoContent();
        }
    }
}