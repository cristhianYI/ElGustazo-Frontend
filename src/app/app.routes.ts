import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PlatosComponent } from './components/platos/platos.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'platos', component: PlatosComponent, canActivate: [authGuard] },
  { path: 'pedidos', component: PedidosComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
