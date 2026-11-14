import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoRequest, PedidoResponse, Plato } from '../models/polleria.model';

@Injectable({ providedIn: 'root' })
export class PolleriaService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  listarPlatos(): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.baseUrl}/platos`);
  }

  listarPlatosEconomicos(precioMax: number): Observable<Plato[]> {
    return this.http.get<Plato[]>(`${this.baseUrl}/platos/economicos?precioMax=${precioMax}`);
  }

  crearPlato(plato: Plato): Observable<Plato> {
    return this.http.post<Plato>(`${this.baseUrl}/platos`, plato);
  }

  eliminarPlato(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/platos/${id}`);
  }

  listarPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.baseUrl}/pedidos`);
  }

  listarPedidosPorEstado(estado: string): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(`${this.baseUrl}/pedidos/por-estado?estado=${estado}`);
  }

  registrarPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(`${this.baseUrl}/pedidos`, pedido);
  }

  actualizarEstadoPedido(id: number, estado: string): Observable<PedidoResponse> {
    return this.http.put<PedidoResponse>(`${this.baseUrl}/pedidos/${id}`, { estado });
  }

  eliminarPedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/pedidos/${id}`);
  }
}
