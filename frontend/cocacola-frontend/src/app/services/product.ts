import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products {

  marcas = [
    {
      nombre: 'Coca-Cola',
      descripcion: 'La bebida icónica y refrescante de siempre.',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Coca-Cola_bottle.jpg'
    },
    {
      nombre: 'Sprite',
      descripcion: 'Sabor limón-lima con un toque refrescante.',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Sprite_20oz.jpg'
    },
    {
      nombre: 'Fanta',
      descripcion: 'Refresco frutal con sabor vibrante y divertido.',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Fanta_Orange_20oz.jpg'
    }
  ];
}