import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  pedidos: any[] = [];
  cargando = true;

  constructor(
    private router: Router,
    private orderService: OrderService
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

    this.orderService.myOrders({ user_id: user.id }).subscribe({
      next: (data: any) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: (err: any) => {
        console.log('Error al cargar pedidos:', err);
        this.cargando = false;
      }
    });
  }
}