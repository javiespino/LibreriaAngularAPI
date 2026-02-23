import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILibro } from '../../features/books/models/ibooks';

@Injectable({
  providedIn: 'root',
})
export class SLibrosApiService {
  private readonly API = 'https://localhost:7101/api/Libros';
  private http = inject(HttpClient);

  getAll() {
    return this.http.get<ILibro[]>(this.API);
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  create(libro: Omit<ILibro, 'id'>) {
    return this.http.post<ILibro>(this.API, libro);
  }

  // sbooks.ts — update ya no espera body (el servidor devuelve 204 No Content)
  update(id: number, libro: Omit<ILibro, 'id'>) {
    return this.http.put(`${this.API}/${id}`, libro, { responseType: 'text' });
  }

  getById(id: number) {
    return this.http.get<ILibro>(`${this.API}/${id}`);
  }
}