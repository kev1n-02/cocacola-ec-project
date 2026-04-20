import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../pages/cart/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  userMenuOpen = false;
  catalogMenuOpen = false;
  eventsMenuOpen = false;
  mobileMenuOpen = false;

  constructor(
    private router: Router,
    private cart: CartService
  ) {}

  get userName(): string {
    const raw = localStorage.getItem('user');
    if (!raw) return 'Usuario';

    const user = JSON.parse(raw);
    return user.nombre || user.correo || 'Usuario';
  }

  get cartCount(): number {
    return this.cart.count();
  }

  toggleMobileMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.mobileMenuOpen = !this.mobileMenuOpen;

    if (!this.mobileMenuOpen) {
      this.closeMenus();
    }
  }

  toggleUserMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
    this.catalogMenuOpen = false;
    this.eventsMenuOpen = false;
  }

  toggleCatalogMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.catalogMenuOpen = !this.catalogMenuOpen;
    this.userMenuOpen = false;
    this.eventsMenuOpen = false;
  }

  toggleEventsMenu(event?: Event): void {
    if (event) event.stopPropagation();
    this.eventsMenuOpen = !this.eventsMenuOpen;
    this.userMenuOpen = false;
    this.catalogMenuOpen = false;
  }

  closeMenus(): void {
    this.userMenuOpen = false;
    this.catalogMenuOpen = false;
    this.eventsMenuOpen = false;
  }

  closeAllMenus(): void {
    this.closeMenus();
    this.mobileMenuOpen = false;
  }

  irCategoria(categoria: string): void {
    this.closeAllMenus();
    this.router.navigate(['/home'], {
      queryParams: { categoria },
      fragment: 'catalogo'
    });
  }

  irPromociones(): void {
    this.closeAllMenus();
    this.router.navigate(['/home'], {
      queryParams: { promociones: 'true' },
      fragment: 'catalogo'
    });
  }

  irEvento(evento: string): void {
    this.closeAllMenus();
    this.router.navigate(['/home'], {
      queryParams: { evento },
      fragment: 'eventos'
    });
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('token');
    this.closeAllMenus();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.private-header')) {
      this.closeAllMenus();
    }
  }
}