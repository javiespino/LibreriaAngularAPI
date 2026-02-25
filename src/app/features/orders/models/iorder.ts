export interface IOrder {
    id: number;
    usuarioId: number;
    usuarioNombre: string; // <-- AÑADIR
    usuarioEmail: string;  // <-- AÑADIR
    fechaPedido: Date;
    total: number;
    estado: string;
    items: IOrderItem[]; // Mejor que 'any'
}

export interface IOrderItem {
    id: number;
    libroId: number;
    libroTitulo: string;
    libroAutor: string;
    libroIsbn: string;
    cantidad: number;
    precioUnitario: number;
}