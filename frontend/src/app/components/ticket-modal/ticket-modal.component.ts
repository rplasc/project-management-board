import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  Ticket, 
  TicketCategory,
  TicketStatus,
  CreateTicketDto, 
  UpdateTicketDto,
  TICKET_CATEGORIES,
  TICKET_STATUSES,
  getStatusDisplayName,
  getCategoryDisplayName
} from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket-modal.component.html',
  styleUrls: ['./ticket-modal.component.css']
})
export class TicketModalComponent implements OnInit, OnChanges {
  @Input() ticket?: Ticket;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateTicketDto | UpdateTicketDto>();
  @Output() delete = new EventEmitter<number>();

  // Form model
  form = {
    name: '',
    description: '',
    category: 'Feature' as TicketCategory,
    status: 'Backlog' as TicketStatus
  };

  // Exposes constants to template
  readonly categories = TICKET_CATEGORIES;
  readonly statuses = TICKET_STATUSES;

  // Validation
  nameError = '';

  ngOnInit(): void {
    this.loadTicketData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reload form data whenever the ticket input changes
    if (changes['ticket'] || changes['isOpen']) {
      this.loadTicketData();
    }
  }

  loadTicketData(): void {
    if (this.ticket) {
      this.form = {
        name: this.ticket.name,
        description: this.ticket.description || '',
        category: this.ticket.category,
        status: this.ticket.status
      };
    } else {
      this.resetForm();
    }
  }

  get isEditMode(): boolean {
    return !!this.ticket;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Edit Ticket' : 'Create Ticket';
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSave(): void {
    if (!this.validateForm()) {
      return;
    }

    const ticketData: CreateTicketDto | UpdateTicketDto = {
      name: this.form.name.trim(),
      description: this.form.description.trim() || undefined,
      category: this.form.category,
      status: this.form.status
    };

    this.save.emit(ticketData);
  }

  onDelete(): void {
    if (this.ticket && confirm('Are you sure you want to delete this ticket?')) {
      this.delete.emit(this.ticket.id);
    }
  }

  validateForm(): boolean {
    this.nameError = '';

    if (!this.form.name.trim()) {
      this.nameError = 'Name is required';
      return false;
    }

    if (this.form.name.trim().length > 200) {
      this.nameError = 'Name cannot exceed 200 characters';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.form = {
      name: '',
      description: '',
      category: 'Feature',
      status: 'Backlog'
    };
    this.nameError = '';
  }

  getStatusLabel(status: TicketStatus): string {
    return getStatusDisplayName(status);
  }

  getCategoryLabel(category: TicketCategory): string {
    return getCategoryDisplayName(category);
  }
}