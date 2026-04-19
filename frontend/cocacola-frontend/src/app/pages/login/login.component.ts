import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  message = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.router.navigate(['/home']);
    }
  }

  login(): void {
    this.message = '';

    const correo = this.username.trim();
    const password = this.password.trim();

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correo) {
      this.message = 'Debes ingresar el correo electrónico';
      return;
    }

    if (!correoValido.test(correo)) {
      this.message = 'Ingresa un correo electrónico válido';
      return;
    }

    if (!password) {
      this.message = 'Debes ingresar la contraseña';
      return;
    }

    this.auth.login(correo, password).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Login exitoso';

        if (res.message === 'Login exitoso') {
          localStorage.setItem('user', JSON.stringify(res.user));

          if (res.token) {
            localStorage.setItem('token', res.token);
          }

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 700);
        }
      },
      error: (err: any) => {
        this.message = err.error?.error || 'Credenciales incorrectas';
      }
    });
  }
}