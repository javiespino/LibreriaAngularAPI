import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  template: `
    <h2>Acceso no autorizado</h2>
    <p>No tienes permisos para ver esta página.</p>
    <button (click)="router.navigate(['/books'])">Volver</button>
  `
})
export class UnauthorizedComponent {
  router = inject(Router);
}