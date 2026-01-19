import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { Ticket, CreateTicketDto, UpdateTicketStatusDto } from '../models/ticket.model';
import { provideHttpClient } from '@angular/common/http';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:5048/api/tickets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TicketService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTickets', () => {
    it('should return an array of tickets', () => {
      const mockTickets: Ticket[] = [
        {
          id: 1,
          name: 'Test Ticket',
          description: 'Test',
          category: 'Feature',
          status: 'Backlog',
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      service.getAllTickets().subscribe(tickets => {
        expect(tickets.length).toBe(1);
        expect(tickets[0].name).toBe('Test Ticket');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockTickets);
    });
  });

  describe('getTicketById', () => {
    it('should return a single ticket', () => {
      const mockTicket: Ticket = {
        id: 1,
        name: 'Test Ticket',
        category: 'Feature',
        status: 'Backlog',
        createdAt: '2024-01-01T00:00:00Z'
      };

      service.getTicketById(1).subscribe(ticket => {
        expect(ticket.id).toBe(1);
        expect(ticket.name).toBe('Test Ticket');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTicket);
    });
  });

  describe('createTicket', () => {
    it('should create a ticket via POST', () => {
      const createDto: CreateTicketDto = {
        name: 'New Ticket',
        description: 'Description',
        category: 'Bug',
        status: 'Backlog'
      };

      const mockResponse: Ticket = {
        id: 1,
        ...createDto,
        createdAt: '2024-01-01T00:00:00Z'
      };

      service.createTicket(createDto).subscribe(ticket => {
        expect(ticket.id).toBe(1);
        expect(ticket.name).toBe('New Ticket');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createDto);
      req.flush(mockResponse);
    });
  });

  describe('updateTicketStatus', () => {
    it('should update ticket status via PATCH', () => {
      const statusDto: UpdateTicketStatusDto = {
        status: 'InProgress'
      };

      const mockResponse: Ticket = {
        id: 1,
        name: 'Test',
        category: 'Feature',
        status: 'InProgress',
        createdAt: '2024-01-01T00:00:00Z'
      };

      service.updateTicketStatus(1, statusDto).subscribe(ticket => {
        expect(ticket.status).toBe('InProgress');
      });

      const req = httpMock.expectOne(`${apiUrl}/1/status`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(statusDto);
      req.flush(mockResponse);
    });
  });

  describe('deleteTicket', () => {
    it('should delete a ticket via DELETE', () => {
      service.deleteTicket(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors gracefully', () => {
      service.getAllTickets().subscribe({
        next: () => fail('should have failed with 500 error'),
        error: (error) => {
          expect(error).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Server error', { status: 500, statusText: 'Server Error' });
    });
  });
});