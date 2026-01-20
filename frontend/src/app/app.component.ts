import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent],
  template: '<app-board></app-board>',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'project-board-frontend';
}
