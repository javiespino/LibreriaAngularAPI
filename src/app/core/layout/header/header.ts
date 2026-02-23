import { Component, computed, inject } from '@angular/core';
import { FCart } from '../../../features/cart/facade/fcart';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { signal } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  private cartFacade = inject(FCart);
  auth               = inject(AuthService);
  private router     = inject(Router);

  isLoggedIn  = computed(() => this.auth.isLoggedIn());
  isLoginPage = signal(false);

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isLoginPage.set(
          e.urlAfterRedirects === '/login' || e.urlAfterRedirects === '/register'
        );
      });
  }

  toggleCart() {
    this.cartFacade.toggle();
  }

  totalItems() {
    return this.cartFacade.totalItems();
  }

  logout() {
    this.cartFacade.clearCart();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToNewBook() {
    this.router.navigate(['/books/new']);
  }
}