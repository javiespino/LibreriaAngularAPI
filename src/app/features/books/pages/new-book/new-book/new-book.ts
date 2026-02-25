import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FLibros } from '../../../facade/fbooks';
import { ILibro } from '../../../models/ibooks';


@Component({
  selector: 'app-new-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-book.html',
  styleUrls: ['./new-book.css'],
})
export class NewBookComponent {
  private librosFacade = inject(FLibros);
  private router       = inject(Router);
  private title        = inject(Title);

  loading = signal(false);
  error   = signal<string | null>(null);

  form = {
    titulo:    '',
    autor:     '',
    sinopsis:  '',
    precio:    null as number | null,
    stock:     null as number | null,
    isbn:      '',
    editorial: '',
    formato:   '',
    edicion:   '',
  };

  errors: Record<string, string> = {};

  ngOnInit() {
    this.title.setTitle('Librería de Javier - Nuevo libro');
  }

  private validarISBN(isbn: string): boolean {
    const clean = isbn.replace(/[-\s]/g, '');
    return /^\d{13}$/.test(clean) || /^\d{10}$/.test(clean);
  }

  private isbnDuplicado(isbn: string): boolean {
    return this.librosFacade.libros().some(l => l.isbn === isbn);
  }

  private validarPrecio(precio: number | null): boolean {
    if (precio === null) return false;
    return precio >= 0 && /^\d+(\.\d{1,2})?$/.test(precio.toString());
  }

  private validarStock(stock: number | null): boolean {
    if (stock === null) return false;
    return Number.isInteger(stock) && stock >= 0;
  }

  validar(): boolean {
    this.errors = {};

    if (!this.form.titulo.trim())
      this.errors['titulo'] = 'El título es obligatorio.';

    if (!this.form.autor.trim())
      this.errors['autor'] = 'El autor es obligatorio.';

    if (!this.form.sinopsis.trim())
      this.errors['sinopsis'] = 'La sinopsis es obligatoria.';

    if (!this.form.isbn.trim())
      this.errors['isbn'] = 'El ISBN es obligatorio.';
    else if (!this.validarISBN(this.form.isbn))
      this.errors['isbn'] = 'El ISBN debe tener 10 o 13 dígitos.';
    else if (this.isbnDuplicado(this.form.isbn.replace(/[-\s]/g, '')))
      this.errors['isbn'] = 'Este ISBN ya existe en la librería.';

    if (this.form.precio === null)
      this.errors['precio'] = 'El precio es obligatorio.';
    else if (!this.validarPrecio(this.form.precio))
      this.errors['precio'] = 'El precio debe ser positivo y tener máximo 2 decimales.';

    if (this.form.stock === null)
      this.errors['stock'] = 'El stock es obligatorio.';
    else if (!this.validarStock(this.form.stock))
      this.errors['stock'] = 'El stock debe ser un número entero positivo.';

    return Object.keys(this.errors).length === 0;
  }

  submit() {
    if (!this.validar()) return;
    this.loading.set(true);
    this.error.set(null);

    const clean = this.form.isbn.replace(/[-\s]/g, '');

    const nuevoLibro: Omit<ILibro, 'id'> = {
      titulo:    this.form.titulo,
      autor:     this.form.autor,
      sinopsis:  this.form.sinopsis,
      precio:    this.form.precio!,
      stock:     this.form.stock!,
      isbn:      clean,
      editorial: this.form.editorial.trim() || 'Sin editorial',
      formato:   this.form.formato.trim()   || 'Sin formato',
      edicion:   this.form.edicion.trim()   || 'Sin edición',
      imagenUrl: `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg`,
    };

    this.librosFacade.createLibro(nuevoLibro).subscribe({
      next: () => this.router.navigate(['/books']),
      error: () => {
        this.error.set('Error al crear el libro. Inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/books']);
  }
}