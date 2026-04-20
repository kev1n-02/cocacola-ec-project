import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../pages/cart/cart.service';
import { Navbar } from '../../components/navbar/navbar';
import { ProductCard } from '../../components/product-card/product-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, ProductCard],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  productos: any[] = [];
  destacados: any[] = [];
  categorias: any[] = [];
  filtroActivo = '';
  userName = 'Usuario';

  detalleAbierto: any = null;
  tipoDetalle: 'marca' | 'evento' | null = null;
  slideActivo = 0;

  ecologia = [
    {
      titulo: 'Reciclaje responsable',
      descripcion: 'Promovemos prácticas de reciclaje y reutilización de envases para reducir el impacto ambiental.',
      imagen: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      titulo: 'Compromiso sostenible',
      descripcion: 'Impulsamos una visión más consciente del consumo con acciones orientadas a la sostenibilidad.',
      imagen: 'https://noticias.utpl.edu.ec/sites/default/files/styles/noticias_slide/public/multimedia/sostenibilidad_un_compromiso_universitario_con_vision_de_futuro.jpg?itok=biTaCP1j'
    },
    {
      titulo: 'Innovación ecológica',
      descripcion: 'Buscamos integrar innovación y responsabilidad ambiental en la experiencia de marca.',
      imagen: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  marcas = [
    {
      nombre: 'Coca-Cola',
      descripcion: 'El sabor original que conecta generaciones.',
      tema: 'coca',
      slides: [
        {
          imagen: 'https://w0.peakpx.com/wallpaper/668/273/HD-wallpaper-coca-cola-classic-red-coca-cola-classic-old.jpg',
          titulo: 'Coca-Cola',
          texto: 'Coca-Cola representa la esencia original de la marca. Su sabor clásico, su identidad roja y blanca y su conexión emocional con generaciones enteras la convierten en una de las bebidas más reconocidas del mundo.'
        },
        {
          imagen: 'https://piedepagina.mx/wp-content/uploads/2022/10/poplab_cocacola_pincheeinnar.jpg',
          titulo: 'Impacto global',
          cajas: [
            'Conexión emocional con generaciones',
            'Presencia global e icónica'
          ]
        }
      ],
      frase: 'El sabor original que convirtió una bebida en un símbolo global.'
    },
    {
      nombre: 'Sprite',
      descripcion: 'Refrescante, ligera y con un toque cítrico único.',
      tema: 'sprite',
      slides: [
        {
          imagen: 'https://lacriaturacreativa.com/wp-content/uploads/2022/05/sprite-nueva-imagen07.jpg',
          titulo: 'Sprite',
        },
        {
          imagen: 'https://img.freepik.com/fotos-premium/agua-salpicando-fruta-limon-amarillo-sobre-fondo-amarillo_33736-4937.jpg',
          titulo: 'Frescura visual',
          cajas: [
            'Perfil cítrico de limón y lima',
            'Que la diversion nunca falte'
          ]
        },
      ],
      
      frase: 'Sprite una explosión de frescura con identidad joven y auténtica.'
    },
    {
      nombre: 'Powerade',
      descripcion: 'Hidratación avanzada para un mejor rendimiento.',
      tema: 'powerade',
      slides: [
        {
          imagen: 'https://e0.pxfuel.com/wallpapers/723/368/desktop-wallpaper-artstation-powerade.jpg',
          titulo: 'Powerade',
          texto: 'Powerade se orienta al rendimiento, la hidratación y la actividad física. Su imagen deportiva y su enfoque funcional la posicionan como una marca asociada a esfuerzo, disciplina y energía.'
        },
        {
          imagen: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
          titulo: 'Rendimiento deportivo',
          cajas: [
            'Enfoque en hidratación y rendimiento',
            'Imagen deportiva y energética'
          ]
        },
        {
          imagen: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
          titulo: 'Fuerza visual',
          cajas: [
            'Identidad visual intensa',
            'Asociación con esfuerzo y constancia'
          ]
        }
      ],
      frase: 'Rendimiento, fuerza e hidratación en una experiencia visual intensa.'
    }
  ];

  eventos = [
    {
      titulo: 'Mundial FIFA',
      descripcion: 'Coca-Cola ha acompañado algunos de los momentos más emocionantes del fútbol mundial con campañas memorables.',
      tema: 'fifa',
      slides: [
        {
          imagen: 'https://www.coca-cola.com/content/dam/onexp/global/central/offerings/fifa-world-cup-2026/campaign-card_fifa-wc-2026_trophy-tour_desktop.png',
          titulo: 'Mundial FIFA',
          texto: 'Coca-Cola mantiene una de las relaciones más históricas con la FIFA. La alianza formal existe desde 1974 y el patrocinio oficial del Mundial comenzó en 1978.'
        },
        {
          imagen: 'https://packagingoftheworld.com/wp-content/uploads/2025/08/4-1.png',
          titulo: 'Historia de alianza',
          cajas: [
            'FIFA x Coca-Cola desde 1974',
            'Patrocinio oficial del Mundial desde 1978'
          ]
        },
        {
          imagen: 'https://imagenes.primicias.ec/files/og_thumbnail/uploads/2024/05/25/6652aa2b34c85.jpeg',
          titulo: 'Impacto global',
          cajas: [
            '20 años de Trophy Tour by Coca-Cola',
            'Más de 4 millones de fans alcanzados'
          ]
        }
      ],
      secciones: [
        {
          titulo: 'Trophy Tour',
          texto: 'Una experiencia global que lleva el trofeo a distintas ciudades para crear cercanía, expectativa y emoción mundialista.',
          imagen: 'https://media.assettype.com/gulfnews/2026-01-04/jxxmr80n/0eBYrjnzi8bGPz8yUNJdLXZ8miAsk1QqWDx3z7VT.webp?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true'
        },
        {
          titulo: 'Alianza histórica',
          texto: 'La relación entre Coca-Cola y FIFA une deporte, identidad de marca y emoción a escala mundial.',
          imagen: 'https://www.coca-colastore.com/media/wysiwyg/2869855-Banners-FIFA.jpg'
        },
        {
          titulo: 'Evento global',
          texto: 'El Mundial permite a Coca-Cola conectar con fanáticos de distintos países a través de activaciones memorables.',
          imagen: 'https://c.files.bbci.co.uk/2257/production/_127719780_aperturaqatar_cris-3.jpg'
        }
      ],
      frase: 'El Trophy Tour convierte el Mundial en una experiencia cercana, visual y emocionante.'
    },
    {
      titulo: 'Coke Music',
      descripcion: 'Una propuesta enfocada en música, talento joven y experiencias cargadas de energía y entretenimiento.',
      tema: 'music',
      spotifyUrl: 'https://open.spotify.com/track/3rw7X1utxqRRCig2Bxua7K',
      slides: [
        {
          imagen: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
          titulo: 'Coke Music',
          texto: 'Coke Studio conecta música, cultura y entretenimiento a escala global, reforzando una imagen moderna y dinámica para Coca-Cola.'
        },
        {
          imagen: 'https://www.coca-cola.com/content/dam/onexp/global/central/offerings/coke-studio-2024/hero_cokestudio2024_karol-g-posing_desktop.jpeg',
          titulo: 'Artistas y escena',
          cajas: [
            'Karol G en Coke Studio 2024',
            'NewJeans y Peggy Gou en el lineup'
          ]
        },
        {
          imagen: 'https://us.123rf.com/450wm/wavebreakmediamicro/wavebreakmediamicro2309/wavebreakmediamicro230907085/213822355-imagen-de-diversos-bailarines-de-hip-hop-femeninos-y-masculinos-durante-el-entrenamiento-en-el.jpg?ver=6',
          titulo: 'Nueva energía',
          cajas: [
            'Anthem 2026: “Jump”',
            'Música, cultura y energía global'
          ]
        }
      ],
      secciones: [
        {
          titulo: 'Karol G y artistas',
          texto: 'Coke Studio destaca artistas globales para conectar con nuevas generaciones mediante una propuesta fresca y actual.',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiNcemBYQVbZodr0Exp-BeYW573cMMAr9CvA&s'
        },
        {
          titulo: 'Experiencia musical',
          texto: 'La marca combina entretenimiento, visuales, performance y storytelling para crear una identidad más vibrante.',
          imagen: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80'
        },
        {
          titulo: 'Jump y FWC 2026',
          texto: '“Jump” conecta música y fútbol como parte de la narrativa global de Coca-Cola para la próxima Copa Mundial.',
          imagen: 'https://i0.wp.com/storylate.com/wp-content/uploads/2026/03/CocaCola-Jump-SL.jpg?fit=1920%2C1080&ssl=1'
        }
      ],
      frase: 'Coke Studio transforma la música en una experiencia cultural con mucha energía.'
    },
    {
      titulo: 'Campañas Coca-Cola',
      descripcion: 'Acciones de marca diseñadas para conectar con emociones, comunidad y experiencias inolvidables.',
      tema: 'campaign',
      slides: [
        {
          imagen: 'https://www.marketingdirecto.com/wp-content/uploads/2025/03/coca-cola-share-a-coke-1.jpg',
          titulo: 'Campañas Coca-Cola',
          texto: 'Coca-Cola ha construido campañas que combinan branding, emoción y cercanía con el consumidor a través de historias memorables.'
        },
        {
          imagen: 'https://www.eluniverso.com/resizer/v2/7GTUM4VEBVEWPNVLN57G2JYX4U.jpg?auth=a553ded1e1df934b35fd583de198c30e78fa870073fdc2559329dc4ef43c977d',
          titulo: 'Campañas icónicas',
          cajas: [
            'Share a Coke y nombres personalizados',
            'Polar Bears como ícono emocional'
          ]
        },
        {
          imagen: 'https://imgproxy.domestika.org/unsafe/w:820/plain/src://content-items/003/621/434/HISTORIA_DE_LOS_LOGOS_3.00_01_56_09.Still025-original.jpg?1579261493',
          titulo: 'Legado visual',
          cajas: [
            'Always Coca-Cola como referencia clásica',
            'Branding basado en emoción y comunidad'
          ]
        }
      ],
      secciones: [
        {
          titulo: 'Share a Coke',
          texto: 'La personalización de nombres en botellas convirtió el producto en algo cercano, compartible y emocional.',
          imagen: 'https://ntcpuce2014.wordpress.com/wp-content/uploads/2014/09/cocacola_27-big.jpg'
        },
        {
          titulo: 'Polar Bears',
          texto: 'Los osos polares se volvieron un recurso visual muy recordado dentro de la historia publicitaria de la marca.',
          imagen: 'https://media.newyorker.com/photos/59095e9b019dfc3494e9fb43/master/pass/Frazier-Animal-Mascots-Climate-Change.jpg'
        },
        {
          titulo: 'Always Coca-Cola',
          texto: 'Una referencia clásica que ayudó a consolidar la identidad global de Coca-Cola con una comunicación optimista.',
          imagen: 'https://i.ebayimg.com/images/g/OEYAAOSwVCRiBAIc/s-l1200.jpg'
        }
      ],
      frase: 'Las campañas de Coca-Cola convierten publicidad en recuerdos y experiencias compartidas.'
    }
  ];

  constructor(
    private productService: ProductService,
    private cart: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  normalizarFiltro(valor: string): string {
    return (valor || '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  esFiltroActivo(valor: string): boolean {
    return this.filtroActivo === this.normalizarFiltro(valor);
  }

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
        this.filtroActivo = 'marca';
        this.filtrarPorMarca(marca, false);
      } else if (categoria) {
        this.filtroActivo = this.normalizarFiltro(categoria);
        this.cargarProductosPorCategoria(categoria, false);
      } else if (promociones === 'true') {
        this.filtroActivo = 'promociones';
        this.cargarPromociones(false);
      } else {
        this.filtroActivo = '';
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

  filtrarCategoria(nombreCategoria: string): void {
    this.filtroActivo = this.normalizarFiltro(nombreCategoria);

    if (this.normalizarFiltro(nombreCategoria) === 'todos') {
      this.cargarProductos();
      this.irCatalogo();
      return;
    }

    this.cargarProductosPorCategoria(nombreCategoria, true);
  }

  cargarProductosPorCategoria(nombreCategoria: string, mover: boolean = true): void {
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

  verPromociones(): void {
    this.filtroActivo = 'promociones';
    this.cargarPromociones(true);
  }

  cargarPromociones(mover: boolean = true): void {
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

  filtrarPorMarca(marca: string, mover: boolean = true): void {
    this.productService.getProductos({ marca }).subscribe({
      next: (data: any) => {
        this.productos = data;
        if (mover) this.irCatalogo();
      },
      error: (err: any) => {
        console.log('ERROR FILTRO MARCA:', err);
      }
    });
  }

  seleccionarMarca(marca: string): void {
    this.filtroActivo = 'marca';
    this.filtrarPorMarca(marca);
  }

  agregarAlCarrito(producto: any): void {
    this.cart.addProduct(producto);
    alert(`"${producto.nombre}" agregado al carrito 🛒`);
  }

  abrirDetalleMarca(marca: any): void {
    this.detalleAbierto = marca;
    this.tipoDetalle = 'marca';
    this.slideActivo = 0;
  }

  abrirDetalleEvento(evento: any): void {
    this.detalleAbierto = evento;
    this.tipoDetalle = 'evento';
    this.slideActivo = 0;
  }

  cerrarDetalle(): void {
    this.detalleAbierto = null;
    this.tipoDetalle = null;
    this.slideActivo = 0;
  }

  irSlide(index: number): void {
    this.slideActivo = index;
  }

  siguienteSlide(): void {
    if (!this.detalleAbierto?.slides?.length) return;
    this.slideActivo = (this.slideActivo + 1) % this.detalleAbierto.slides.length;
  }

  anteriorSlide(): void {
    if (!this.detalleAbierto?.slides?.length) return;
    this.slideActivo =
      (this.slideActivo - 1 + this.detalleAbierto.slides.length) %
      this.detalleAbierto.slides.length;
  }

  get slideActual(): any {
    if (!this.detalleAbierto?.slides?.length) return null;
    return this.detalleAbierto.slides[this.slideActivo];
  }

  getClaseMarca(nombre: string): string {
    const normalizado = this.normalizarFiltro(nombre);

    if (normalizado.includes('coca')) return 'brand-coca';
    if (normalizado.includes('sprite')) return 'brand-sprite';
    if (normalizado.includes('powerade')) return 'brand-powerade';

    return '';
  }

  getClaseEvento(nombre: string): string {
    const normalizado = this.normalizarFiltro(nombre);

    if (normalizado.includes('mundial')) return 'event-fifa';
    if (normalizado.includes('music')) return 'event-music';
    if (normalizado.includes('campan')) return 'event-campaign';

    return '';
  }

  getClaseDetalle(): string {
    if (!this.detalleAbierto) return '';
    return this.tipoDetalle === 'marca'
      ? this.getClaseMarca(this.detalleAbierto.nombre)
      : this.getClaseEvento(this.detalleAbierto.titulo);
  }

  getTituloDetalle(): string {
    if (!this.detalleAbierto) return '';
    return this.tipoDetalle === 'marca'
      ? this.detalleAbierto.nombre
      : this.detalleAbierto.titulo;
  }

  irCatalogo(): void {
    requestAnimationFrame(() => {
      document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
}