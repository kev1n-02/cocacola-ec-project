import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private key = 'cart';

  getCart(): any[] {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }

  saveCart(cart: any[]): void {
    localStorage.setItem(this.key, JSON.stringify(cart));
  }

  addProduct(product: any): void {
    const cart = this.getCart();

    const existingProduct = cart.find((p: any) => p.id === product.id);

    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      cart.push({
        ...product,
        cantidad: 1
      });
    }

    this.saveCart(cart);
  }

  increaseQuantity(index: number): void {
    const cart = this.getCart();
    cart[index].cantidad += 1;
    this.saveCart(cart);
  }

  decreaseQuantity(index: number): void {
    const cart = this.getCart();

    if (cart[index].cantidad > 1) {
      cart[index].cantidad -= 1;
    } else {
      cart.splice(index, 1);
    }

    this.saveCart(cart);
  }

  remove(index: number): void {
    const cart = this.getCart();
    cart.splice(index, 1);
    this.saveCart(cart);
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }

  total(): number {
    return this.getCart().reduce((sum, p) => {
      return sum + Number(p.precio || 0) * Number(p.cantidad || 1);
    }, 0);
  }

  count(): number {
    return this.getCart().reduce((sum, p) => {
      return sum + Number(p.cantidad || 1);
    }, 0);
  }
}