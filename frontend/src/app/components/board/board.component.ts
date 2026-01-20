import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TicketService } from '../../services/ticket.service';
import { 
  Ticket, 
  TicketStatus,
  TicketCategory,
  CreateTicketDto, 
  UpdateTicketDto,
  getCategoryDisplayName
} from '../../models/ticket.model';
import { TicketCardComponent } from '../ticket-card/ticket-card.component';
import { TicketModalComponent } from '../ticket-modal/ticket-modal.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule, 
    TicketCardComponent, 
    TicketModalComponent
  ],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  // Separated arrays for each swimlane
  backlog: Ticket[] = [];
  inProgress: Ticket[] = [];
  review: Ticket[] = [];
  done: Ticket[] = [];

  // All tickets (unfiltered)
  allTickets: Ticket[] = [];

  // Filter state
  selectedCategoryFilter: TicketCategory | 'All' = 'All';
  readonly filterOptions: Array<TicketCategory | 'All'> = ['All', 'Feature', 'Bug', 'RAndD'];

  // UI state
  isLoading = false;
  errorMessage = '';
  isModalOpen = false;
  selectedTicket?: Ticket;

  // For drag-and-drop connection
  readonly statusLists = ['backlog', 'inProgress', 'review', 'done'];

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getAllTickets().subscribe({
      next: (tickets) => {
        this.allTickets = tickets;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = `Failed to load tickets: ${error.message}`;
        console.error('Load error:', error);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    let filteredTickets = this.allTickets;

    if (this.selectedCategoryFilter !== 'All') {
      filteredTickets = this.allTickets.filter(
        t => t.category === this.selectedCategoryFilter
      );
    }

    this.distributeTickets(filteredTickets);
  }

  onFilterChange(category: TicketCategory | 'All'): void {
    this.selectedCategoryFilter = category;
    this.applyFilter();
  }

  distributeTickets(tickets: Ticket[]): void {
    this.backlog = tickets.filter(t => t.status === 'Backlog');
    this.inProgress = tickets.filter(t => t.status === 'InProgress');
    this.review = tickets.filter(t => t.status === 'Review');
    this.done = tickets.filter(t => t.status === 'Done');
  }

  onDrop(event: CdkDragDrop<Ticket[]>): void {
    const ticket = event.item.data;
    
    if (!ticket) {
      console.error('No ticket data in drag event');
      this.errorMessage = 'Failed to move ticket: Invalid ticket data';
      return;
    }

    const newStatus = this.getStatusFromContainerId(event.container.id);

    if (event.previousContainer === event.container) {
      // Same column (reorder)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Different column (move and update status)
      const previousArray = event.previousContainer.data;
      const currentArray = event.container.data;
      const oldStatus = ticket.status;

      transferArrayItem(
        previousArray,
        currentArray,
        event.previousIndex,
        event.currentIndex
      );

      // Updates the ticket's status locally
      ticket.status = newStatus;

      // Backend sync
      this.ticketService.updateTicketStatus(ticket.id, { status: newStatus }).subscribe({
        next: (updatedTicket) => {
          const index = currentArray.findIndex(t => t.id === ticket.id);
          if (index !== -1) {
            currentArray[index] = updatedTicket;
          }
        },
        error: (error) => {
          // Rollback on failure
          console.error('Failed to update ticket status:', error);
          
          // Revert the status
          ticket.status = oldStatus;
          
          // Move back to original position
          const currentIndex = currentArray.findIndex(t => t.id === ticket.id);
          if (currentIndex !== -1) {
            transferArrayItem(
              currentArray, 
              previousArray, 
              currentIndex, 
              event.previousIndex
            );
          }
          
          this.errorMessage = `Failed to move ticket: ${error.message}`;
          
          // Clear error after 3 seconds
          setTimeout(() => {
            if (this.errorMessage.includes('Failed to move ticket')) {
              this.errorMessage = '';
            }
          }, 3000);
        }
      });
    }
  }

  getStatusFromContainerId(containerId: string): TicketStatus {
    switch (containerId) {
      case 'backlog': return 'Backlog';
      case 'inProgress': return 'InProgress';
      case 'review': return 'Review';
      case 'done': return 'Done';
      default: return 'Backlog';
    }
  }

  openCreateModal(): void {
    this.selectedTicket = undefined;
    this.isModalOpen = true;
  }

  openEditModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedTicket = undefined;
  }

  onSaveTicket(ticketData: CreateTicketDto | UpdateTicketDto): void {
    if (this.selectedTicket) {
      this.ticketService.updateTicket(this.selectedTicket.id, ticketData as UpdateTicketDto)
        .subscribe({
          next: () => {
            this.loadTickets();
            this.closeModal();
          },
          error: (error) => {
            this.errorMessage = `Failed to update ticket: ${error.message}`;
            console.error('Update error:', error);
          }
        });
    } else {
      // Creates new ticket
      this.ticketService.createTicket(ticketData as CreateTicketDto).subscribe({
        next: (createdTicket) => {
          console.log('Ticket created successfully:', createdTicket);
          this.loadTickets();
          this.closeModal();
        },
        error: (error) => {
          this.errorMessage = `Failed to create ticket: ${error.message}`;
          console.error('Create error:', error);
        }
      });
    }
  }

  onDeleteTicket(ticketId: number): void {
    this.ticketService.deleteTicket(ticketId).subscribe({
      next: () => {
        this.loadTickets();
        this.closeModal();
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete ticket. Please try again.';
        console.error('Delete error:', error);
      }
    });
  }

  getColumnTitle(status: string): string {
    switch (status) {
      case 'inProgress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  }

  getCategoryLabel(category: TicketCategory | 'All'): string {
    if (category === 'All') return 'All Categories';
    return getCategoryDisplayName(category);
  }
}