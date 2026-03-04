import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  templateUrl: './unauthorized.html',
  styleUrls: ['./unauthorized.css']
})
export class UnauthorizedComponent {
  router = inject(Router);
}