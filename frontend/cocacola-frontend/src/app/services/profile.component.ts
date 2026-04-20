import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Navbar } from '../../app/components/navbar/navbar';
import { ProfileService } from '../../app/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    nacionalidad: '',
    telefono: '',
    cedula: '',
    correo: ''
  };

  passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  message = '';
  passwordMessage = '';
  loading = true;

  constructor(
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    const rawUser = localStorage.getItem('user');

    if (!rawUser) {
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(rawUser);

    if (!user?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileService.getProfile(user.id).subscribe({
      next: (data: any) => {
        this.form = {
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          fecha_nacimiento: data.fecha_nacimiento || '',
          nacionalidad: data.nacionalidad || '',
          telefono: data.telefono || '',
          cedula: data.cedula || '',
          correo: data.correo || ''
        };
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.message = 'No se pudo cargar el perfil';
        this.loading = false;
      }
    });
  }

  get inicial(): string {
    const nombreCompleto = `${this.form.nombre} ${this.form.apellido}`.trim();
    return nombreCompleto ? nombreCompleto.charAt(0).toUpperCase() : 'U';
  }

  get nombreCompleto(): string {
    return `${this.form.nombre} ${this.form.apellido}`.trim() || 'Usuario';
  }

  guardarCambios(): void {
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileService.updateProfile({
      user_id: user.id,
      ...this.form
    }).subscribe({
      next: () => {
        this.message = 'Perfil actualizado correctamente';

        const updatedUser = {
          ...user,
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          correo: this.form.correo
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.error || 'No se pudo actualizar el perfil';
      }
    });
  }

  cambiarPassword(): void {
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileService.changePassword({
      user_id: user.id,
      ...this.passwordForm
    }).subscribe({
      next: () => {
        this.passwordMessage = 'Contraseña actualizada correctamente';
        this.passwordForm = {
          current_password: '',
          new_password: '',
          confirm_password: ''
        };
      },
      error: (err: any) => {
        console.log(err);
        this.passwordMessage = err.error?.error || 'No se pudo cambiar la contraseña';
      }
    });
  }

  eliminarCuenta(): void {
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user?.id) {
      this.router.navigate(['/login']);
      return;
    }

    const confirmar = confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.');

    if (!confirmar) return;

    this.profileService.deleteAccount(user.id).subscribe({
      next: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        localStorage.removeItem('token');
        this.router.navigate(['/register']);
      },
      error: (err: any) => {
        console.log(err);
        this.message = err.error?.error || 'No se pudo eliminar la cuenta';
      }
    });
  }
}