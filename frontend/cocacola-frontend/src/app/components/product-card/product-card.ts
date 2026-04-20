import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {
  @Input() product: any;
  @Output() buy = new EventEmitter<any>();
  @Output() detail = new EventEmitter<any>();

  comprar(event: Event): void {
    event.stopPropagation();
    this.buy.emit(this.product);
  }

  verDetalle(): void {
    this.detail.emit(this.product);
  }
}