import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FCart } from '../../facade/fcart';
import { ILibro } from '../../../books/models/ibooks';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.html',
  styleUrls: ['./cart-summary.css']
})
export class CartComponent {
  private cartFacade = inject(FCart);
  private router     = inject(Router);

  items    = this.cartFacade.items;
  showCart = computed(() => this.cartFacade.showCart());

  add(libro: ILibro) {
    const itemActual = this.items().find(i => i.libro.id === libro.id);
    if (itemActual && itemActual.quantity >= libro.stock) return;
    this.cartFacade.addLibro(libro);
  }

  decrease(id: number) {
    this.cartFacade.decreaseLibro(id);
  }

  remove(id: number) {
    this.cartFacade.removeLibro(id);
  }

  totalPrice() {
    return this.cartFacade.totalPrice();
  }

  clearCart() {
    this.cartFacade.clearCart();
  }

  closeCart() {
    this.cartFacade.close();
  }

  cantidadEnCarrito(libroId: number): number {
    return this.items().find(i => i.libro.id === libroId)?.quantity ?? 0;
  }

  checkout() {
    this.cartFacade.close();
    this.router.navigate(['/checkout']);
  }
}