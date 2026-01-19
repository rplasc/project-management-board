export type TicketCategory = 'Feature' | 'Bug' | 'RAndD';
export type TicketStatus = 'Backlog' | 'InProgress' | 'Review' | 'Done';

export interface Ticket {
  id: number;
  name: string;
  description?: string | null;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
}

export interface CreateTicketDto {
  name: string;
  description?: string;
  category: TicketCategory;
  status: TicketStatus;
}

export interface UpdateTicketDto {
  name: string;
  description?: string;
  category: TicketCategory;
  status: TicketStatus;
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
}

// Constants for type-safe usage
export const TICKET_CATEGORIES: TicketCategory[] = ['Feature', 'Bug', 'RAndD'];
export const TICKET_STATUSES: TicketStatus[] = ['Backlog', 'InProgress', 'Review', 'Done'];

// Helper functions
export function getStatusDisplayName(status: TicketStatus): string {
  switch (status) {
    case 'InProgress': return 'In Progress';
    default: return status;
  }
}

export function getCategoryDisplayName(category: TicketCategory): string {
  return category === 'RAndD' ? 'R&D' : category;
}
