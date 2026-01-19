import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  Ticket, 
  CreateTicketDto, 
  UpdateTicketDto, 
  UpdateTicketStatusDto 
} from '../models/ticket.model';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly apiUrl = 'http://localhost:5048/api/tickets'; // Default API

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getTicketById(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  createTicket(ticket: CreateTicketDto): Observable<Ticket> {
    return this.http.post<Ticket>(this.apiUrl, ticket)
      .pipe(catchError(this.handleError));
  }

  updateTicket(id: number, ticket: UpdateTicketDto): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket)
      .pipe(catchError(this.handleError));
  }

  updateTicketStatus(id: number, statusDto: UpdateTicketStatusDto): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/${id}/status`, statusDto)
      .pipe(catchError(this.handleError));
  }

  deleteTicket(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error?.message || `Server returned code ${error.status}`;
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}