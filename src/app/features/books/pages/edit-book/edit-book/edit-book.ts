import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FLibros } from '../../../facade/fbooks';
import { ILibro } from '../../../models/ibooks';


@Component({
  selector: 'app-edit-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book.html',
  styleUrls: ['./edit-book.css'],
})
export class EditBookComponent implements OnInit {
  private librosFacade = inject(FLibros);
  private router       = inject(Router);
  private route        = inject(ActivatedRoute);

  loading      = signal(false);
  loadingPage  = signal(true);
  error        = signal<string | null>(null);
  errors: Record<string, string> = {};

  libroId!: number;

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
    imagenUrl: '',
  };

  ngOnInit() {
    this.libroId = Number(this.route.snapshot.paramMap.get('id'));
    this.librosFacade.getLibroById(this.libroId).subscribe({
      next: (libro) => {
        this.form = {
          titulo:    libro.titulo,
          autor:     libro.autor,
          sinopsis:  libro.sinopsis,
          precio:    libro.precio,
          stock:     libro.stock,
          isbn:      libro.isbn,
          editorial: libro.editorial,
          formato:   libro.formato,
          edicion:   libro.edicion,
          imagenUrl: libro.imagenUrl,
        };
        this.loadingPage.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el libro.');
        this.loadingPage.set(false);
      }
    });
  }

  private validarISBN(isbn: string): boolean {
    const clean = isbn.replace(/[-\s]/g, '');
    return /^\d{13}$/.test(clean) || /^\d{10}$/.test(clean);
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

    const libroActualizado: Omit<ILibro, 'id'> = {
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

    this.librosFacade.updateLibro(this.libroId, libroActualizado).subscribe({
      next: () => this.router.navigate(['/books']),
      error: () => {
        this.error.set('Error al actualizar el libro. Inténtalo de nuevo.');
        this.loading.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/books']);
  }
}