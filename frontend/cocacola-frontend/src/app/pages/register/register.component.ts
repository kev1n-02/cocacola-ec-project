import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  nombre = '';
  apellido = '';
  fecha_nacimiento = '';
  nacionalidad = '';
  correo = '';
  telefono = '';
  cedula = '';
  password = '';
  confirm_password = '';
  message = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  register(): void {
    this.message = '';

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const soloNumeros = /^[0-9]+$/;
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordFuerte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@._\-#$%&*!])[A-Za-z\d@._\-#$%&*!]{6,}$/;

    // =========================
    // NOMBRE
    // =========================
    if (!this.nombre.trim()) {
      this.message = 'Debes ingresar los nombres';
      return;
    }

    if (!soloLetras.test(this.nombre)) {
      this.message = 'Los nombres solo deben contener letras';
      return;
    }

    // =========================
    // APELLIDO
    // =========================
    if (!this.apellido.trim()) {
      this.message = 'Debes ingresar los apellidos';
      return;
    }

    if (!soloLetras.test(this.apellido)) {
      this.message = 'Los apellidos solo deben contener letras';
      return;
    }

    // =========================
    // FECHA NACIMIENTO
    // =========================
    if (!this.fecha_nacimiento) {
      this.message = 'Debes ingresar la fecha de nacimiento';
      return;
    }

    const hoy = new Date();
    const nacimiento = new Date(this.fecha_nacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad < 18) {
      this.message = 'Debes ser mayor de edad para registrarte';
      return;
    }

    // =========================
    // NACIONALIDAD
    // =========================
    if (!this.nacionalidad.trim()) {
      this.message = 'Debes ingresar la nacionalidad';
      return;
    }

    if (!soloLetras.test(this.nacionalidad)) {
      this.message = 'La nacionalidad solo debe contener letras';
      return;
    }

    // =========================
    // CORREO
    // =========================
    if (!this.correo.trim()) {
      this.message = 'Debes ingresar el correo electrónico';
      return;
    }

    if (!correoValido.test(this.correo)) {
      this.message = 'Ingresa un correo electrónico válido';
      return;
    }

    // =========================
    // CÉDULA
    // =========================
    if (!this.cedula.trim()) {
      this.message = 'Debes ingresar la cédula';
      return;
    }

    if (!soloNumeros.test(this.cedula)) {
      this.message = 'La cédula solo debe contener números';
      return;
    }

    if (!this.validarCedulaEcuatoriana(this.cedula)) {
      this.message = 'La cédula ecuatoriana no es válida';
      return;
    }

    // =========================
    // PASSWORD
    // =========================
    if (!this.password.trim()) {
      this.message = 'Debes ingresar la contraseña';
      return;
    }

    if (!passwordFuerte.test(this.password)) {
      this.message = 'La contraseña debe tener mínimo 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
      return;
    }

    if (this.password !== this.confirm_password) {
      this.message = 'Las contraseñas no coinciden';
      return;
    }

    // =========================
    // ENVÍO
    // =========================
    const data = {
      nombre: this.nombre,
      apellido: this.apellido,
      fecha_nacimiento: this.fecha_nacimiento,
      nacionalidad: this.nacionalidad,
      correo: this.correo,
      telefono: this.telefono,
      cedula: this.cedula,
      password: this.password,
      confirm_password: this.confirm_password,
      username: this.correo
    };

    this.auth.register(data).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Usuario registrado correctamente';

        // si quieres login automático:
        if (res.token) {
          localStorage.setItem('token', res.token);
        }

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 900);
      },
      error: (err: any) => {
        this.message = err.error?.error || 'Error en registro';
      }
    });
  }

  // =========================
  // VALIDACIÓN CÉDULA ECUADOR
  // =========================
  validarCedulaEcuatoriana(cedula: string): boolean {
    if (cedula.length !== 10) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    const tercerDigito = parseInt(cedula[2], 10);

    if (provincia < 1 || provincia > 24) return false;
    if (tercerDigito >= 6) return false;

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula[i], 10) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }

    const verificador = (10 - (suma % 10)) % 10;

    return verificador === parseInt(cedula[9], 10);
  }
}