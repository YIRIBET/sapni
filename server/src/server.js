require('dotenv').config();
const app = require('./app');
const db = require('./config/database');

const PORT = process.env.PORT || 3000;

// Verificar conexión a la base de datos
db.raw('SELECT 1')
  .then(() => {
    console.log('Conexión a la base de datos exitosa');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });