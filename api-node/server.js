const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Node Coca-Cola EC funcionando 🚀');
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Conexión exitosa con la API Node',
    status: 'ok'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});