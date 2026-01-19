import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket, getCategoryDisplayName } from '../../models/ticket.model';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket-card.component.html',
  styleUrls: ['./ticket-card.component.css']
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Output() ticketClick = new EventEmitter<Ticket>();

  onClick(): void {
    this.ticketClick.emit(this.ticket);
  }

  getCategoryClass(): string {
    switch (this.ticket.category) {
      case 'Bug':
        return 'category-bug';
      case 'Feature':
        return 'category-feature';
      case 'RAndD':
        return 'category-randd';
      default:
        return '';
    }
  }

  getCategoryLabel(): string {
    return getCategoryDisplayName(this.ticket.category);
  }
}