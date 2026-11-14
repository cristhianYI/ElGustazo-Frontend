export interface Plato {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  disponible: boolean;
}

export interface DetallePedidoRequest {
  platoId: number;
  cantidad: number;
}

export interface PedidoRequest {
  usuarioId: number;
  detalles: DetallePedidoRequest[];
}

export interface DetallePedidoResponse {
  id: number;
  platoId: number;
  platoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoResponse {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  username: string;
  detalles: DetallePedidoResponse[];
}
