/**
 * ===========================================================
 * PROYECTO: CocaCola EC Web Replica
 * AUTOR: Kevin Yalama
 * FECHA: 08/04/2026
 * DESCRIPCIÓN:
 * Servidor principal para levantar la API Node.js
 * del sistema de compras.
 * ===========================================================
 */

require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Node.js corriendo en http://localhost:${PORT}`);
});