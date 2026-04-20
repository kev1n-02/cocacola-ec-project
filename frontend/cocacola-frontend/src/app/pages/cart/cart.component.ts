import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../pages/cart/cart.service';
import { OrderService } from '../../services/order.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  nombresFacturacion = '';
  direccionFacturacion = '';
  cedulaFacturacion = '';

  constructor(
    private router: Router,
    public cart: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('user')) {
      this.router.navigate(['/login']);
    }
  }

  get items() {
    return this.cart.getCart();
  }

  increase(index: number): void {
    this.cart.increaseQuantity(index);
  }

  decrease(index: number): void {
    this.cart.decreaseQuantity(index);
  }

  remove(index: number): void {
    this.cart.remove(index);
  }

  clear(): void {
    this.cart.clear();
  }

  subtotal(): number {
    return this.items.reduce((sum: number, item: any) => {
      return sum + Number(item.precio) * Number(item.cantidad);
    }, 0);
  }

  iva(): number {
    return this.subtotal() * 0.15;
  }

  total(): number {
    return this.subtotal() + this.iva();
  }

  comprar(): void {
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?.id;

    if (!userId) {
      alert('Debes iniciar sesión');
      return;
    }

    if (this.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    if (!this.nombresFacturacion || !this.direccionFacturacion || !this.cedulaFacturacion) {
      alert('Completa todos los datos de facturación');
      return;
    }

    const items = this.items.map((item: any) => ({
      producto_id: item.id,
      cantidad: item.cantidad
    }));

    this.orderService.createOrder({
      user_id: userId,
      items,
      nombres_facturacion: this.nombresFacturacion,
      direccion_facturacion: this.direccionFacturacion,
      cedula_facturacion: this.cedulaFacturacion
    }).subscribe({
      next: () => {
        alert('Compra realizada con éxito 🎉');
        this.cart.clear();
        this.router.navigate(['/my-orders']);
      },
      error: (err: any) => {
        console.log(err);
        alert('Error al procesar la compra');
      }
    });
  }
}