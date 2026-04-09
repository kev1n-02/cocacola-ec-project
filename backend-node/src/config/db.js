/**
 * ===========================================================
 * PROYECTO: CocaCola EC Web Replica
 * AUTOR: Kevin Yalama
 * FECHA: 08/04/2026
 * DESCRIPCIÓN:
 * Configuración de conexión a PostgreSQL para la API
 * de productos, carrito y compras del sistema.
 * ===========================================================
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;