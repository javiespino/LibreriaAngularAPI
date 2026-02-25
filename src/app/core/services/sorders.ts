import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IOrder } from '../../features/orders/models/iorder';
import { ICreateOrder } from '../../features/orders/facade/forders';

@Injectable({
  providedIn: 'root',
})
export class SOrdersApiService {
  private readonly API = 'https://localhost:7101/api/Pedidos';
  private http = inject(HttpClient);

  getByUsuario(usuarioId: number) {
    return this.http.get<IOrder[]>(`${this.API}/usuario/${usuarioId}`);
  }

  create(order: ICreateOrder) {
    return this.http.post<number>(this.API, order); // devuelve id del nuevo pedido
  }

  updateEstado(id: number, nuevoEstado: string) {
    return this.http.put(`${this.API}/${id}/estado`, JSON.stringify(nuevoEstado), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAll() {
    return this.http.get<IOrder[]>(this.API);
  }
}