import { Routes } from '@angular/router';
import { CBooks } from './features/books/pages/cbooks/cbooks';
import { LoginComponent } from './features/login/login/login';
import { authGuard } from './core/services/auth-guard';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized/unauthorized';
import { NewBookComponent } from './features/books/pages/new-book/new-book/new-book';
import { EditBookComponent } from './features/books/pages/edit-book/edit-book/edit-book';
import { CheckoutComponent } from './features/checkout/checkout/checkout';
import { RegisterComponent } from './features/login/register/register';
import { OrdersComponent } from './features/orders/pages/corders/corders';

export const routes: Routes = [
  { path: 'login',        component: LoginComponent },
  { path: 'register',     component: RegisterComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '', redirectTo: 'books', pathMatch: 'full' },

  { path: 'books', component: CBooks },

  {
    path: 'books/new',
    component: NewBookComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'books/edit/:id',
    component: EditBookComponent,
    canActivate: [authGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [authGuard],
    data: { roles: ['user', 'admin'] }
  },
  {
    path: 'orders',
    component: OrdersComponent,
    canActivate: [authGuard],
    data: { roles: ['user', 'admin'] }
  },

  { path: '**', redirectTo: 'books' }
];