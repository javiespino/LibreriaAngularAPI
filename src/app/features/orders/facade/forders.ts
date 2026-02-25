import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { SOrdersApiService } from '../../../core/services/sorders'; 
import { IOrder } from '../models/iorder';
import { AuthService } from '../../../core/services/auth';

// Interfaz para la creación (POST)
export interface ICreateOrderItem {
  libroId:        number;
  cantidad:       number;
  precioUnitario: number;
}

export interface ICreateOrder {
  usuarioId: number;
  total:     number;
  items:     ICreateOrderItem[];
}

@Injectable({
  providedIn: 'root',
})
export class FOrders {
  private api  = inject(SOrdersApiService);
  private auth = inject(AuthService);

  orders  = signal<IOrder[]>([]);
  loading = signal(false);

  loadByUsuario(usuarioId: number) {
    this.loading.set(true);
    const request = usuarioId === 0 ? this.api.getAll() : this.api.getByUsuario(usuarioId);
    
    request.subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  createOrder(order: ICreateOrder) {
    return this.api.create(order).pipe(
      tap((nuevoId) => {
        const user = this.auth.currentUser();
        
        const nuevoPedido: IOrder = {
          id:            nuevoId,
          usuarioId:     order.usuarioId,
          usuarioNombre: user?.username || 'Usuario', 
          usuarioEmail:  '',
          total:         order.total,
          fechaPedido:   new Date(),
          estado:        'Pendiente',
          items:         order.items as any 
        };
        
        this.orders.update(orders => [nuevoPedido, ...orders]);
      })
    );
  }

  updateEstado(id: number, nuevoEstado: string) {
    return this.api.updateEstado(id, nuevoEstado).pipe(
      tap(() => {
        this.orders.update(orders =>
          orders.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o)
        );
      })
    );
  }

  clearOrders() {
    this.orders.set([]);
  }
}