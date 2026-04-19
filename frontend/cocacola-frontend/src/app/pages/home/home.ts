import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CartService } from '../../pages/cart/cart.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  productos: any[] = [];
  destacados: any[] = [];
  categorias: any[] = [];
  categoriaActiva = 'todos';
  userName = 'Usuario';

  ecologia = [
    {
      titulo: 'Reciclaje responsable',
      descripcion: 'Promovemos prácticas de reciclaje y reutilización de envases para reducir el impacto ambiental.',
      imagen: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      titulo: 'Compromiso sostenible',
      descripcion: 'Impulsamos una visión más consciente del consumo con acciones orientadas a la sostenibilidad.',
      imagen: 'https://estaticos-cdn.prensaiberica.es/clip/3d56caa0-e167-47ca-b7ec-5ddf01ce5f26_16-9-aspect-ratio_default_0.jpg'
    },
    {
      titulo: 'Innovación ecológica',
      descripcion: 'Buscamos integrar innovación y responsabilidad ambiental en la experiencia de marca.',
      imagen: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  eventos = [
    {
      titulo: 'Mundial FIFA',
      descripcion: 'Coca-Cola ha acompañado algunos de los momentos más emocionantes del fútbol mundial con campañas memorables.',
      imagen: 'https://www.marketingregistrado.com/img/noticias/tour-trofeo-copa-mundial-fifa-presentado-coca-cola-llega-argentina.webp'
    },
    {
      titulo: 'Coke Music',
      descripcion: 'Una propuesta enfocada en música, talento joven y experiencias cargadas de energía y entretenimiento.',
      imagen: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80'
    },
    {
      titulo: 'Campañas Coca-Cola',
      descripcion: 'Acciones de marca diseñadas para conectar con emociones, comunidad y experiencias inolvidables.',
      imagen: 'https://imagenes.montevideo.com.uy/imgnoticias/202504/_W933_80/917842.jpg'
    }
  ];

  marcas = [
    {
      nombre: 'Coca-Cola',
      descripcion: 'El sabor original que conecta generaciones.',
      imagen: 'https://w0.peakpx.com/wallpaper/668/273/HD-wallpaper-coca-cola-classic-red-coca-cola-classic-old.jpg'
    },
    {
      nombre: 'Sprite',
      descripcion: 'Refrescante, ligera y con un toque cítrico único.',
      imagen: 'https://lacriaturacreativa.com/wp-content/uploads/2022/05/sprite-nueva-imagen07.jpg'
    },
    {
      nombre: 'Powerade',
      descripcion: 'Hidratación avanzada para un mejor rendimiento.',
      imagen: 'https://e0.pxfuel.com/wallpapers/723/368/desktop-wallpaper-artstation-powerade.jpg'
    }
  ];

  constructor(
    private productService: ProductService,
    private cart: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    this.router.navigate(['/login']);
    return;
  }

  const user = JSON.parse(rawUser);
  this.userName = user.nombre || user.correo || 'Usuario';

  this.cargarCategorias();
  this.cargarDestacados();

  this.route.queryParams.subscribe(params => {
    const marca = params['marca'];
    const categoria = params['categoria'];
    const promociones = params['promociones'];
    const evento = params['evento'];

    if (marca) {
      this.filtrarPorMarca(marca);
    } else if (categoria) {
      this.filtrarCategoria(categoria, false);
    } else if (promociones === 'true') {
      this.verPromociones(false);
    } else {
      this.categoriaActiva = 'todos';
      this.cargarProductos();
    }

    if (evento) {
      setTimeout(() => {
        document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }

    const fragment = this.route.snapshot.fragment;
    if (fragment === 'catalogo') {
      setTimeout(() => {
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }

    if (fragment === 'eventos') {
      setTimeout(() => {
        document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  });
}


  cargarCategorias(): void {
    this.productService.getCategorias().subscribe({
      next: (data: any) => {
        this.categorias = data;
      },
      error: (err: any) => {
        console.log('ERROR CATEGORIAS:', err);
      }
    });
  }

  cargarProductos(): void {
    this.productService.getProductos().subscribe({
      next: (data: any) => {
        this.productos = data;
      },
      error: (err: any) => {
        console.log('ERROR PRODUCTOS:', err);
      }
    });
  }

  cargarDestacados(): void {
    this.productService.getProductos({ destacados: true }).subscribe({
      next: (data: any) => {
        this.destacados = data;
      },
      error: (err: any) => {
        console.log('ERROR DESTACADOS:', err);
      }
    });
  }

  filtrarCategoria(nombreCategoria: string, mover: boolean = true): void {
    this.categoriaActiva = nombreCategoria;

    if (nombreCategoria === 'todos') {
      this.cargarProductos();
      if (mover) this.irCatalogo();
      return;
    }

    this.productService.getProductos({ categoria: nombreCategoria }).subscribe({
      next: (data: any) => {
        this.productos = data;
        if (mover) this.irCatalogo();
      },
      error: (err: any) => {
        console.log('ERROR FILTRO CATEGORIA:', err);
      }
    });
  }

  verPromociones(mover: boolean = true): void {
    this.categoriaActiva = 'promociones';

    this.productService.getProductos({ promociones: true }).subscribe({
      next: (data: any) => {
        this.productos = data;
        if (mover) this.irCatalogo();
      },
      error: (err: any) => {
        console.log('ERROR PROMOCIONES:', err);
      }
    });
  }

  filtrarPorMarca(marca: string): void {
    this.productService.getProductos({ marca }).subscribe({
      next: (data: any) => {
        this.productos = data;
        this.irCatalogo();
      },
      error: (err: any) => {
        console.log('ERROR FILTRO MARCA:', err);
      }
    });
  }

  seleccionarMarca(marca: string): void {
    this.filtrarPorMarca(marca);
  }

  agregarAlCarrito(producto: any): void {
    this.cart.addProduct(producto);
    alert(`"${producto.nombre}" agregado al carrito 🛒`);
  }

  irCatalogo(): void {
    setTimeout(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}