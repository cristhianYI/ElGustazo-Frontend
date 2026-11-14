import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login', standalone: true, imports: [CommonModule, ReactiveFormsModule],
  template: `<div class="login-wrapper"><div class="card login-card"><h2>Pollería El Gustazo</h2><p class="subtitle">Acceso al Sistema</p><div class="alert alert-error" *ngIf="errorMsg">{{ errorMsg }}</div><form [formGroup]="loginForm" (ngSubmit)="onSubmit()"><div class="form-group"><label>Usuario</label><input type="text" formControlName="username" placeholder="admin o cliente"></div><div class="form-group"><label>Contraseña</label><input type="password" formControlName="password"></div><button type="submit" class="btn btn-primary full-btn" [disabled]="loginForm.invalid || cargando">{{ cargando ? 'Validando...' : 'Iniciar Sesión' }}</button></form></div></div>`,
  styles: [`.login-wrapper { display: flex; justify-content: center; align-items: center; min-height: 85vh; } .login-card { width: 100%; max-width: 400px; h2 { color: #8b1e1e; } .subtitle { color: #6c757d; margin-bottom: 1.5rem; } } .full-btn { width: 100%; }`]
})
export class LoginComponent {
  loginForm: FormGroup; errorMsg = ''; cargando = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({ username: ['', Validators.required], password: ['', [Validators.required, Validators.minLength(4)]] });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.cargando = true; this.errorMsg = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: () => { this.cargando = false; this.router.navigate(['/platos']); },
      error: (err) => { this.cargando = false; this.errorMsg = err.status === 401 ? 'Credenciales incorrectas (401)' : 'Error de conexión'; }
    });
  }
}
