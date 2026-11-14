import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolleriaService } from '../../services/polleria.service';
import { AuthService } from '../../services/auth.service';
import { DetallePedidoRequest, PedidoResponse, Plato } from '../../models/polleria.model';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="alert alert-error" *ngIf="errorMsg">{{ errorMsg }}</div>
      <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>

      <div class="card">
        <h3>Nuevo Pedido (Maestro-Detalle)</h3>
        <div class="add-row">
          <div class="form-group">
            <label>Plato</label>
            <select [(ngModel)]="platoId">
              <option [ngValue]="0">-- Seleccione --</option>
              <option *ngFor="let p of platos" [ngValue]="p.id">{{ p.nombre }} (S/ {{ p.precio }})</option>
            </select>
          </div>
          <div class="form-group">
            <label>Cantidad</label>
            <input type="number" [(ngModel)]="cantidad" min="1">
          </div>
          <button class="btn btn-dark" (click)="agregar()">+ Agregar</button>
        </div>

        <table *ngIf="carrito.length">
          <thead>
            <tr>
              <th>Plato</th>
              <th>Cant.</th>
              <th>Precio</th>
              <th>Subtotal</th>
              <th>Quitar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let c of carrito; let i = index">
              <td>{{ c.nombre }}</td>
              <td>{{ c.cantidad }}</td>
              <td>S/ {{ c.precio }}</td>
              <td><strong>S/ {{ c.precio * c.cantidad | number:'1.2-2' }}</strong></td>
              <td><button class="btn btn-danger" (click)="carrito.splice(i,1)">X</button></td>
            </tr>
          </tbody>
        </table>

        <div class="checkout" *ngIf="carrito.length">
          <h4>Total: S/ {{ total() | number:'1.2-2' }}</h4>
          <button class="btn btn-success" (click)="confirmar()">Confirmar Pedido</button>
        </div>
      </div>

      <div class="card">
        <div class="header-bar">
          <h3>Pedidos Registrados</h3>
          <div class="filter-box">
            <select [(ngModel)]="estadoFiltro" style="width:150px">
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="ENTREGADO">ENTREGADO</option>
            </select>
            <button class="btn btn-primary" (click)="filtrarEstado()">Filtrar Estado (JPQL)</button>
            <button class="btn btn-dark" (click)="cargarPedidos()">Todos</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Detalles</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let ped of pedidos">
              <td>#{{ ped.id }}</td>
              <td>{{ ped.username }}</td>
              <td>
                <ul>
                  <li *ngFor="let d of ped.detalles">{{ d.cantidad }}x {{ d.platoNombre }} (S/ {{ d.subtotal }})</li>
                </ul>
              </td>
              <td><strong>S/ {{ ped.total | number:'1.2-2' }}</strong></td>
              <td>{{ ped.estado }}</td>
              <td style="display:flex;gap:5px">
                <button class="btn btn-success" *ngIf="ped.estado==='PENDIENTE'" (click)="entregar(ped.id)">Entregar</button>
                <button class="btn btn-danger" (click)="eliminar(ped.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .add-row { display: grid; grid-template-columns: 2fr 1fr auto; gap: 1rem; align-items: end; margin-top: 1rem; }
    .checkout, .header-bar, .filter-box { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; margin-top: 1rem; }
    ul { padding-left: 1rem; }
  `]
})
export class PedidosComponent implements OnInit {
  platos: Plato[] = [];
  pedidos: PedidoResponse[] = [];
  carrito: any[] = [];
  platoId = 0;
  cantidad = 1;
  estadoFiltro = 'PENDIENTE';
  errorMsg = '';
  successMsg = '';

  constructor(private srv: PolleriaService, private auth: AuthService) {}

  ngOnInit(): void {
    this.srv.listarPlatos().subscribe(d => this.platos = d);
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.srv.listarPedidos().subscribe(d => this.pedidos = d);
  }

  filtrarEstado(): void {
    this.srv.listarPedidosPorEstado(this.estadoFiltro).subscribe(d => {
      this.pedidos = d;
      this.successMsg = 'Filtro: ' + this.estadoFiltro;
    });
  }

  agregar(): void {
    if (!this.platoId || this.cantidad < 1) {
      this.errorMsg = 'Seleccione plato y cantidad >= 1';
      return;
    }
    const p = this.platos.find(x => x.id === this.platoId);
    if (p) {
      this.carrito.push({ platoId: p.id!, nombre: p.nombre, precio: p.precio, cantidad: this.cantidad });
      this.platoId = 0;
      this.cantidad = 1;
      this.errorMsg = '';
    }
  }

  total(): number {
    return this.carrito.reduce((a, b) => a + b.precio * b.cantidad, 0);
  }

  confirmar(): void {
    const detalles: DetallePedidoRequest[] = this.carrito.map(c => ({ platoId: c.platoId, cantidad: c.cantidad }));
    this.srv.registrarPedido({ usuarioId: this.auth.getUserId(), detalles }).subscribe({
      next: (r) => {
        this.successMsg = 'Pedido #' + r.id + ' creado (Total: S/ ' + r.total + ')';
        this.carrito = [];
        this.cargarPedidos();
      },
      error: () => this.errorMsg = 'Error al registrar pedido'
    });
  }

  entregar(id: number): void {
    this.srv.actualizarEstadoPedido(id, 'ENTREGADO').subscribe(() => this.cargarPedidos());
  }

  eliminar(id: number): void {
    this.errorMsg = '';
    this.srv.eliminarPedido(id).subscribe({
      next: () => {
        this.successMsg = 'Pedido eliminado';
        this.cargarPedidos();
      },
      error: (e) => this.errorMsg = e.status === 403 ? '403 Forbidden: Solo ADMIN puede eliminar pedidos' : 'Error al eliminar'
    });
  }
}
