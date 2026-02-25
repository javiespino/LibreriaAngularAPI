import { Component, OnInit, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FOrders } from '../../facade/forders';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule], // CurrencyPipe y DatePipe ya vienen en CommonModule
  templateUrl: './corders.html',
  styleUrls: ['./corders.css']
})
export class OrdersComponent implements OnInit {
  private fOrders = inject(FOrders);
  private auth = inject(AuthService);

  // Usamos signals directamente desde la fachada
  orders = this.fOrders.orders;
  loading = this.fOrders.loading;

  ngOnInit(): void {
    this.loadOrders();
  }

  reload(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    if (this.auth.isAdmin()) {
      this.fOrders.loadByUsuario(0);
    } else {
      const user = this.auth.currentUser();
      if (user?.id) {
        this.fOrders.loadByUsuario(user.id);
      }
    }
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  cambiarEstado(orderId: number, nuevoEstado: string): void {
    this.fOrders.updateEstado(orderId, nuevoEstado).subscribe({
    });
  }
}