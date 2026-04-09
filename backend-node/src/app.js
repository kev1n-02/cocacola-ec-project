/**
 * ===========================================================
 * PROYECTO: CocaCola EC Web Replica
 * AUTOR: Kevin Yalama
 * FECHA: 08/04/2026
 * DESCRIPCIÓN:
 * Archivo principal de configuración de Express para la API
 * del sistema de compras de Coca-Cola EC.
 * ===========================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'API de CocaCola EC funcionando correctamente 🚀'
  });
});

module.exports = app;