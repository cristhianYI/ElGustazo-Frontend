import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar', standalone: true, imports: [CommonModule, RouterModule],
  template: `<nav class="navbar" *ngIf="authService.isLoggedIn()"><div class="brand">Pollería <span>El Gustazo</span></div><div class="links"><a routerLink="/platos" routerLinkActive="active">Carta de Platos</a><a routerLink="/pedidos" routerLinkActive="active">Pedidos (Maestro-Detalle)</a></div><div class="user-info"><span class="badge">{{ authService.getUsername() }} ({{ authService.getRol() }})</span><button class="btn btn-primary" (click)="salir()">Salir</button></div></nav>`,
  styles: [`.navbar { background: #1f2428; color: #fff; padding: 0.9rem 2rem; display: flex; justify-content: space-between; align-items: center; } .brand { font-size: 1.25rem; font-weight: 700; span { color: #e05252; } } .links { display: flex; gap: 1.5rem; a { color: #d0d7de; text-decoration: none; &.active { color: #fff; border-bottom: 2px solid #8b1e1e; } } } .user-info { display: flex; align-items: center; gap: 1rem; .badge { background: #343a40; padding: 0.35rem 0.75rem; border-radius: 20px; } }`]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}
  salir(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
