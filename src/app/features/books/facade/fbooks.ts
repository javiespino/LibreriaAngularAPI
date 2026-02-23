import { inject, Injectable, signal } from '@angular/core';
import { ILibro } from '../models/ibooks';
import { SLibrosApiService } from '../../../core/services/sbooks';
import { of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FLibros {
  private api = inject(SLibrosApiService);

  libros  = signal<ILibro[]>([]);
  loading = signal(false);

  loadLibros() {
    this.loading.set(true);
    this.api.getAll().subscribe(libros => {
      this.libros.set(libros);
      this.loading.set(false);
    });
  }

  deleteLibro(id: number) {
    this.api.delete(id).subscribe(() => {
      this.libros.update(libros => libros.filter(l => l.id !== id));
    });
  }

  createLibro(libro: Omit<ILibro, 'id'>) {
    return this.api.create(libro).pipe(
      tap(nuevo => this.libros.update(libros => [...libros, nuevo]))
    );
  }

  getLibroById(id: number) {
    return this.api.getById(id);
  }

  // El servidor devuelve 204, actualizamos el signal con datos locales
  updateLibro(id: number, libro: Omit<ILibro, 'id'>) {
    return this.api.update(id, libro).pipe(
      tap(() => {
        this.libros.update(libros =>
          libros.map(l => l.id === id ? { ...l, ...libro } : l)
        );
      })
    );
  }

  descontarStock(id: number, cantidad: number) {
    const libroLocal = this.libros().find(l => l.id === id);

    const libro$ = libroLocal
      ? of(libroLocal)
      : this.api.getById(id);

    return libro$.pipe(
      switchMap(libro => {
        if (!libro) {
          console.error(`Libro con id ${id} no encontrado`);
          return of(null);
        }

        const libroActualizado: Omit<ILibro, 'id'> = {
          ...libro,
          stock: libro.stock - cantidad
        };

        // 204 sin body — actualizamos el signal localmente con los datos que ya tenemos
        return this.api.update(id, libroActualizado).pipe(
          tap(() => {
            this.libros.update(libros =>
              libros.map(l =>
                l.id === id ? { ...l, stock: l.stock - cantidad } : l
              )
            );
          })
        );
      })
    );
  }
}