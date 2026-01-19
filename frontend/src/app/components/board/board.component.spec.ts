import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { BoardComponent } from './board.component';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../models/ticket.model';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;

  const mockTickets: Ticket[] = [
    {
      id: 1,
      name: 'Feature Ticket',
      category: 'Feature',
      status: 'Backlog',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Bug Ticket',
      category: 'Bug',
      status: 'InProgress',
      createdAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 3,
      name: 'R&D Ticket',
      category: 'RAndD',
      status: 'Review',
      createdAt: '2024-01-03T00:00:00Z'
    }
  ];

  beforeEach(async () => {
    const ticketServiceSpy = jasmine.createSpyObj('TicketService', [
      'getAllTickets',
      'createTicket',
      'updateTicket',
      'updateTicketStatus',
      'deleteTicket'
    ]);

    await TestBed.configureTestingModule({
      imports: [BoardComponent, DragDropModule],
      providers: [
        { provide: TicketService, useValue: ticketServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    ticketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadTickets', () => {
    it('should load and distribute tickets on init', () => {
      ticketService.getAllTickets.and.returnValue(of(mockTickets));

      component.ngOnInit();

      expect(component.isLoading).toBe(false);
      expect(component.backlog.length).toBe(1);
      expect(component.inProgress.length).toBe(1);
      expect(component.review.length).toBe(1);
      expect(component.done.length).toBe(0);
    });

    it('should handle loading errors', () => {
      ticketService.getAllTickets.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      component.loadTickets();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toContain('Failed to load tickets');
    });
  });

  describe('filtering', () => {
    beforeEach(() => {
      component.allTickets = mockTickets;
    });

    it('should show all tickets when filter is "All"', () => {
      component.selectedCategoryFilter = 'All';
      component.applyFilter();

      const totalTickets = component.backlog.length + 
                          component.inProgress.length + 
                          component.review.length + 
                          component.done.length;
      expect(totalTickets).toBe(3);
    });

    it('should filter by Feature category', () => {
      component.selectedCategoryFilter = 'Feature';
      component.applyFilter();

      const totalTickets = component.backlog.length + 
                          component.inProgress.length + 
                          component.review.length + 
                          component.done.length;
      expect(totalTickets).toBe(1);
      expect(component.backlog[0].category).toBe('Feature');
    });

    it('should filter by Bug category', () => {
      component.selectedCategoryFilter = 'Bug';
      component.applyFilter();

      const totalTickets = component.backlog.length + 
                          component.inProgress.length + 
                          component.review.length + 
                          component.done.length;
      expect(totalTickets).toBe(1);
      expect(component.inProgress[0].category).toBe('Bug');
    });
  });

  describe('modal operations', () => {
    it('should open create modal', () => {
      component.openCreateModal();

      expect(component.isModalOpen).toBe(true);
      expect(component.selectedTicket).toBeUndefined();
    });

    it('should open edit modal with selected ticket', () => {
      const ticket = mockTickets[0];
      component.openEditModal(ticket);

      expect(component.isModalOpen).toBe(true);
      expect(component.selectedTicket).toBe(ticket);
    });

    it('should close modal', () => {
      component.isModalOpen = true;
      component.selectedTicket = mockTickets[0];

      component.closeModal();

      expect(component.isModalOpen).toBe(false);
      expect(component.selectedTicket).toBeUndefined();
    });
  });

  describe('getStatusFromContainerId', () => {
    it('should map container IDs to status values', () => {
      expect(component.getStatusFromContainerId('backlog')).toBe('Backlog');
      expect(component.getStatusFromContainerId('inProgress')).toBe('InProgress');
      expect(component.getStatusFromContainerId('review')).toBe('Review');
      expect(component.getStatusFromContainerId('done')).toBe('Done');
    });
  });
});