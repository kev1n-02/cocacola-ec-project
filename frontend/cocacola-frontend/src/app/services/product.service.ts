import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';

  constructor(private http: HttpClient) {}

  getProductos(filters?: {
    categoria?: string;
    marca?: string;
    destacados?: boolean;
    promociones?: boolean;
  }) {
    let params = new HttpParams();

    if (filters?.categoria) {
      params = params.set('categoria', filters.categoria);
    }

    if (filters?.marca) {
      params = params.set('marca', filters.marca);
    }

    if (filters?.destacados) {
      params = params.set('destacados', 'true');
    }

    if (filters?.promociones) {
      params = params.set('promociones', 'true');
    }

    return this.http.get(`${this.apiUrl}/productos/`, { params });
  }

  getCategorias() {
    return this.http.get(`${this.apiUrl}/categorias/`);
  }
}