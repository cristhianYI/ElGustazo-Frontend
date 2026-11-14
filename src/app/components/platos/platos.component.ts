import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PolleriaService } from '../../services/polleria.service';
import { AuthService } from '../../services/auth.service';
import { Plato } from '../../models/polleria.model';

@Component({
  selector: 'app-platos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="container">
      <div class="alert alert-error" *ngIf="errorMsg">{{ errorMsg }}</div>
      <div class="alert alert-success" *ngIf="successMsg">{{ successMsg }}</div>

      <div class="card">
        <h3>Registrar Plato ({{ authService.getRol() }})</h3>
        <form [formGroup]="platoForm" (ngSubmit)="guardarPlato()" class="grid-form">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" formControlName="nombre" placeholder="Ej. 1/2 Pollo a la Brasa">
          </div>
          <div class="form-group">
            <label>Descripción</label>
            <input type="text" formControlName="descripcion" placeholder="Con papas y ensalada">
          </div>
          <div class="form-group">
            <label>Precio (S/)</label>
            <input type="number" formControlName="precio" step="0.50">
          </div>
          <div class="form-group">
            <button type="submit" class="btn btn-success" [disabled]="platoForm.invalid">Guardar</button>
          </div>
        </form>
      </div>

      <div class="card">
        <div class="header-bar">
          <h3>Carta Disponible</h3>
          <div class="filter-box">
            <label>Máx S/:</label>
            <input type="number" [(ngModel)]="precioMax" style="width:80px">
            <button class="btn btn-primary" (click)="filtrarEconomicos()">Económicos (JPQL)</button>
            <button class="btn btn-dark" (click)="cargarPlatos()">Todos</button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Plato</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of platos">
              <td>{{ p.id }}</td>
              <td><strong>{{ p.nombre }}</strong></td>
              <td>{{ p.descripcion }}</td>
              <td>S/ {{ p.precio | number:'1.2-2' }}</td>
              <td><button class="btn btn-danger" (click)="eliminar(p.id!)">Eliminar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .grid-form { display: grid; grid-template-columns: 2fr 2fr 1fr auto; gap: 1rem; align-items: end; margin-top: 1rem; }
    .header-bar, .filter-box { display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; }
  `]
})
export class PlatosComponent implements OnInit {
  platos: Plato[] = [];
  platoForm: FormGroup;
  precioMax = 25.0;
  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private srv: PolleriaService, public authService: AuthService) {
    this.platoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: [null, [Validators.required, Validators.min(0.1)]],
      disponible: [true]
    });
  }

  ngOnInit(): void {
    this.cargarPlatos();
  }

  cargarPlatos(): void {
    this.srv.listarPlatos().subscribe(d => this.platos = d);
  }

  filtrarEconomicos(): void {
    this.srv.listarPlatosEconomicos(this.precioMax).subscribe(d => {
      this.platos = d;
      this.successMsg = 'Platos <= S/ ' + this.precioMax;
    });
  }

  guardarPlato(): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.srv.crearPlato(this.platoForm.value).subscribe({
      next: () => {
        this.successMsg = 'Plato creado (201 Created)';
        this.platoForm.reset({ disponible: true });
        this.cargarPlatos();
      },
      error: (e) => this.errorMsg = e.status === 403 ? '403 Forbidden: Solo ADMIN puede crear platos' : 'Error al guardar'
    });
  }

  eliminar(id: number): void {
    this.errorMsg = '';
    this.successMsg = '';
    this.srv.eliminarPlato(id).subscribe({
      next: () => {
        this.successMsg = 'Plato eliminado';
        this.cargarPlatos();
      },
      error: (e) => this.errorMsg = e.status === 403 ? '403 Forbidden: Solo ADMIN puede eliminar' : 'No se puede eliminar (tiene pedidos)'
    });
  }
}
