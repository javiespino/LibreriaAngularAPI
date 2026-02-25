import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CartComponent } from '../../../cart/component/cart-summary/cart-summary';
import { FCart } from '../../../cart/facade/fcart';
import { ILibro } from '../../models/ibooks';
import { FLibros } from '../../facade/fbooks';
import { AuthService } from '../../../../core/services/auth';

type SearchField = 'titulo' | 'autor';
type SortOption = 'precio-asc' | 'precio-desc' | 'stock-asc' | 'stock-desc' | 'none';

@Component({
  selector: 'app-cbooks',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CartComponent, FormsModule],
  templateUrl: './cbooks.html',
  styleUrls: ['./cbooks.css'],
})
export class CBooks {
  private librosFacade = inject(FLibros);
  private cartFacade   = inject(FCart);
  private router       = inject(Router);
  private title        = inject(Title);
  auth                 = inject(AuthService);

  libros  = this.librosFacade.libros;
  loading = this.librosFacade.loading;

  searchQuery  = signal('');
  searchField  = signal<SearchField>('titulo');
  sortOption   = signal<SortOption>('none');
  currentPage  = signal(1);
  pageSize     = signal(18);
  pageSizes    = [9, 18, 36, 72];

  libroAEliminar  = signal<ILibro | null>(null);
  libroSeleccionado = signal<ILibro | null>(null);

  filteredLibros = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const field = this.searchField();
    const sort  = this.sortOption();

    let result = this.libros().filter(libro =>
      !query || libro[field]?.toLowerCase().includes(query)
    );

    switch (sort) {
      case 'precio-asc':  result = [...result].sort((a, b) => a.precio - b.precio); break;
      case 'precio-desc': result = [...result].sort((a, b) => b.precio - a.precio); break;
      case 'stock-asc':   result = [...result].sort((a, b) => a.stock  - b.stock);  break;
      case 'stock-desc':  result = [...result].sort((a, b) => b.stock  - a.stock);  break;
    }

    return result;
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredLibros().length / this.pageSize())
  );

  paginatedLibros = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredLibros().slice(start, start + this.pageSize());
  });

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit() {
    this.librosFacade.loadLibros();
    this.title.setTitle('Librería de Javier - Estantería');
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  onSearchChange() {
    this.currentPage.set(1);
  }

  addToCart(libro: ILibro) {
    if (this.cantidadEnCarrito(libro.id) >= libro.stock) return;
    this.cartFacade.addLibro(libro);
  }

  cantidadEnCarrito(libroId: number): number {
    return this.cartFacade.items().find(i => i.libro.id === libroId)?.quantity ?? 0;
  }

  editLibro(libro: ILibro) {
    this.router.navigate(['/books/edit', libro.id]);
  }

  pedirConfirmacionBorrar(libro: ILibro) {
    this.libroAEliminar.set(libro);
  }

  confirmarBorrar() {
    const libro = this.libroAEliminar();
    if (libro) {
      this.librosFacade.deleteLibro(libro.id);
      this.libroAEliminar.set(null);
    }
  }

  cancelarBorrar() {
    this.libroAEliminar.set(null);
  }

  verDetalle(libro: ILibro) {
    this.libroSeleccionado.set(libro);
  }

  cerrarDetalle() {
    this.libroSeleccionado.set(null);
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (!img.src.includes('no-image.png')) img.src = '/no-image.png';
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth <= 1 || img.naturalHeight <= 1) img.src = '/no-image.png';
  }
}