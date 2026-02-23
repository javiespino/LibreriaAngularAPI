import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FCart } from '../../cart/facade/fcart';
import { forkJoin, Observable } from 'rxjs';
import { FLibros } from '../../books/facade/fbooks';

type MetodoPago = 'tarjeta' | 'paypal' | 'reembolso';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class CheckoutComponent {
  private cartFacade   = inject(FCart);
  private librosFacade = inject(FLibros);
  private router       = inject(Router);

  items      = this.cartFacade.items;
  totalPrice = this.cartFacade.totalPrice;

  metodoPago = signal<MetodoPago>('tarjeta');
  loading    = signal(false);
  pedidoOk   = signal(false);
  errors: Record<string, string> = {};

  form = {
    nombre:    '',
    apellidos: '',
    email:     '',
    telefono:  '',
    direccion: '',
    ciudad:    '',
    provincia: '',
    cp:        '',
    numTarjeta:  '',
    titular:     '',
    caducidad:   '',
    cvv:         '',
    emailPaypal: '',
  };

  validar(): boolean {
    this.errors = {};

    if (!this.form.nombre.trim())     this.errors['nombre']    = 'El nombre es obligatorio.';
    if (!this.form.apellidos.trim())  this.errors['apellidos'] = 'Los apellidos son obligatorios.';
    if (!this.form.email.trim())      this.errors['email']     = 'El email es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email))
                                      this.errors['email']     = 'El email no es válido.';
    if (!this.form.telefono.trim())   this.errors['telefono']  = 'El teléfono es obligatorio.';
    if (!this.form.direccion.trim())  this.errors['direccion'] = 'La dirección es obligatoria.';
    if (!this.form.ciudad.trim())     this.errors['ciudad']    = 'La ciudad es obligatoria.';
    if (!this.form.provincia.trim())  this.errors['provincia'] = 'La provincia es obligatoria.';
    if (!this.form.cp.trim())         this.errors['cp']        = 'El código postal es obligatorio.';
    else if (!/^\d{5}$/.test(this.form.cp))
                                      this.errors['cp']        = 'El código postal debe tener 5 dígitos.';

    if (this.metodoPago() === 'tarjeta') {
      if (!this.form.numTarjeta.replace(/\s/g, '').match(/^\d{16}$/))
        this.errors['numTarjeta'] = 'El número de tarjeta debe tener 16 dígitos.';
      if (!this.form.titular.trim())
        this.errors['titular'] = 'El titular es obligatorio.';
      if (!this.form.caducidad.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
        this.errors['caducidad'] = 'Formato MM/AA.';
      if (!this.form.cvv.match(/^\d{3,4}$/))
        this.errors['cvv'] = 'CVV inválido.';
    }

    if (this.metodoPago() === 'paypal') {
      if (!this.form.emailPaypal.trim())
        this.errors['emailPaypal'] = 'El email de PayPal es obligatorio.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.emailPaypal))
        this.errors['emailPaypal'] = 'El email de PayPal no es válido.';
    }

    return Object.keys(this.errors).length === 0;
  }

  confirmarPedido() {
    if (!this.validar()) return;
    this.loading.set(true);

    const actualizaciones = this.items()
      .map(item => this.librosFacade.descontarStock(item.libro.id, item.quantity) as Observable<any>);

    setTimeout(() => {
      forkJoin(actualizaciones).subscribe({
        next: () => {
          this.cartFacade.clearCart();
          this.loading.set(false);
          this.pedidoOk.set(true);
        },
        error: () => {
          this.loading.set(false);
          this.errors['general'] = 'Error al procesar el pedido. Inténtalo de nuevo.';
        }
      });
    }, 1500);
  }

    volverATienda() {
      this.router.navigate(['/books']);
    }
  }