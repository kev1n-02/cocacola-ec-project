import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://127.0.0.1:8000/api/users/orders';

  constructor(private http: HttpClient) {}

  createOrder(data: any) {
    return this.http.post(`${this.apiUrl}/create/`, data);
  }

  myOrders(data: any) {
    return this.http.post(`${this.apiUrl}/my-orders/`, data);
  }

  orderDetail(data: any) {
    return this.http.post(`${this.apiUrl}/detail/`, data);
  }
}