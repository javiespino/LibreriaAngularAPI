import { ILibro } from "../../books/models/ibooks";
import { ICart } from "../models/icart";
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class FCart {
  items = signal<ICart[]>([]);

  addLibro(libro: ILibro) {
    this.items.update(items => {
      const found = items.find(i => i.libro.id === libro.id);
      if (found) {
        return items.map(i =>
          i.libro.id === libro.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { libro, quantity: 1 }];
    });
  }

  removeLibro(libroId: number) {
    this.items.update((items: any[]) =>
      items.filter(i => i.libro.id !== libroId)
    );
  }

  clearCart() {
    this.items.set([]);
  }

  totalItems() {
    return this.items().reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  totalPrice() {
    return this.items().reduce(
      (sum, item) =>
        sum + item.libro.precio * item.quantity,
      0
    );
  }

  decreaseLibro(libroId: number) {
    this.items.update(items =>
      items
        .map(i =>
          i.libro.id === libroId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  }

  showCart = signal(false);
  toggle() {
    console.log('toggle llamado, showCart antes:', this.showCart());
    this.showCart.update(v => !v);
    console.log('showCart después:', this.showCart());
  }

  close() {
    this.showCart.set(false);
  }
}