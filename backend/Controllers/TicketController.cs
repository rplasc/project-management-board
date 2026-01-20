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

            // Additional validation
            if (string.IsNullOrWhiteSpace(createDto.Name))
            {
                return BadRequest(new { message = "Ticket name cannot be empty or whitespace" });
            }

            try
            {
                var ticket = await _ticketService.CreateTicketAsync(createDto);
                return CreatedAtAction(nameof(GetTicket), new { id = ticket.Id }, ticket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating ticket");
                return StatusCode(500, new { message = "An error occurred while creating the ticket" });
            }
        }

        // PUT: api/tickets/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TicketDto>> UpdateTicket(int id, [FromBody] UpdateTicketDto updateDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid ticket ID" });
            }

            if (string.IsNullOrWhiteSpace(updateDto.Name))
            {
                return BadRequest(new { message = "Ticket name cannot be empty or whitespace" });
            }

            try
            {
                var ticket = await _ticketService.UpdateTicketAsync(id, updateDto);

                if (ticket == null)
                {
                    return NotFound(new { message = $"Ticket with ID {id} not found" });
                }

                return Ok(ticket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ticket {TicketId}", id);
                return StatusCode(500, new { message = "An error occurred while updating the ticket" });
            }
        }

        // PATCH: api/tickets/5/status
        [HttpPatch("{id}/status")]
        public async Task<ActionResult<TicketDto>> UpdateTicketStatus(int id, [FromBody] UpdateTicketStatusDto statusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid ticket ID" });
            }

            try
            {
                var ticket = await _ticketService.UpdateTicketStatusAsync(id, statusDto);

                if (ticket == null)
                {
                    return NotFound(new { message = $"Ticket with ID {id} not found" });
                }

                return Ok(ticket);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating ticket status for ticket {TicketId}", id);
                return StatusCode(500, new { message = "An error occurred while updating ticket status" });
            }
        }

        // DELETE: api/tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "Invalid ticket ID" });
            }

            try
            {
                var deleted = await _ticketService.DeleteTicketAsync(id);

                if (!deleted)
                {
                    return NotFound(new { message = $"Ticket with ID {id} not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting ticket {TicketId}", id);
                return StatusCode(500, new { message = "An error occurred while deleting the ticket" });
            }
        }
    }
}