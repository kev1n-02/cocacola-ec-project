/*
===========================================================
PROYECTO: CocaCola EC Web Replica
AUTOR: Kevin Yalama
FECHA: 08/04/2026
DESCRIPCIÓN:
Datos iniciales de prueba para categorías y productos
del catálogo de bebidas.
===========================================================
*/

-- =========================
-- INSERTAR CATEGORÍAS
-- =========================
INSERT INTO categorias (nombre, descripcion) VALUES
('Gaseosas', 'Bebidas carbonatadas clásicas de Coca-Cola'),
('Sin Azúcar', 'Bebidas sin azúcar o bajas en calorías'),
('Jugos', 'Bebidas frutales y jugos refrescantes'),
('Hidratación', 'Bebidas hidratantes y deportivas'),
('Aguas', 'Aguas purificadas y saborizadas');

-- =========================
-- INSERTAR PRODUCTOS
-- =========================
INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id) VALUES
('Coca-Cola Original 500ml', 'Bebida gaseosa clásica Coca-Cola', 1.25, 100, 'cocacola-original.jpg', 1),
('Coca-Cola Zero 500ml', 'Bebida Coca-Cola sin azúcar', 1.25, 100, 'cocacola-zero.jpg', 2),
('Fanta Naranja 500ml', 'Bebida gaseosa sabor naranja', 1.10, 80, 'fanta-naranja.jpg', 1),
('Sprite 500ml', 'Bebida gaseosa sabor limón', 1.10, 80, 'sprite.jpg', 1),
('Powerade Azul 600ml', 'Bebida isotónica sabor frutos azules', 1.75, 60, 'powerade-azul.jpg', 4),
('Del Valle Naranja 1L', 'Jugo sabor naranja', 2.20, 40, 'delvalle-naranja.jpg', 3),
('Dasani 600ml', 'Agua purificada', 0.85, 120, 'dasani.jpg', 5);