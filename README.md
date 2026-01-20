
# Project Management Board

A full-stack Kanban board built with Angular 19 and .NET 10. This project demonstrates clean architecture and drag-and-drop mechanics.

## Prerequisites

* **.NET 10 SDK**
* **Node.js** (v22 or higher)
* **Angular CLI** (Optional, can run via npm script)

## How to Run

### 1. Backend (.NET)
The backend uses **SQLite**, so no external database installation is required.

1.  Navigate to the project folder: `/backend`
2.  Run `dotnet run`
3.  The API will start at `http://localhost:5048` (or your configured port).
    * *Note: The database file will be automatically created on the first run with seeded data.*
    * *Swagger UI is available at: http://localhost:5048/swagger*

### 2. Frontend (Angular)
1.  Navigate to `/frontend`
2.  Run `npm install`
3.  Run `ng serve`
4.  Open `http://localhost:4200` in your browser.

## Assumptions & Trade-offs

To deliver the core requirements within the timebox, I made the following decisions:

* **Database:** I chose **SQLite** for portability. This avoids needing to set up a local SQL Server instance for review.
* **Authentication:** Per the requirements, user authentication was skipped to focus on the board mechanics. I assumed a single-user environment fits the scope of the assessment.
* **Drag & Drop:** I utilized `@angular/cdk` rather than native HTML5 drag-and-drop for better cross-browser consistency and smoother animations.
* **State Management:** I used RxJS `BehaviorSubjects` in services rather than a full library (NgRx) to keep the architecture simple and appropriate for this scale.

## Testing
Within the given timeframe, I implemented unit testing for the frontend.

1. Navigate to `/frontend`
2. Run `ng test`
3. The browser should automatically open `http://localhost:9876` and run the suite.

## Completed Stretch Goals
* **Filtering:** Added a category filter toolbar to the top of the board.
* **Error Handling:** Improved UI feedback for API errors

## Future Improvements
Given more time, I would address:
* **Backend Testing:** Adding Unit Tests for the `TicketController` and Service layers in the .NET API.
