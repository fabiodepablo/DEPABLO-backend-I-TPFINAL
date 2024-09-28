const express = require('express');
const exphbs = require('express-handlebars');
const connectDB = require('./db');

const app = express();

// Configuración del motor de plantillas Handlebars
app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main', // Configura 'main' como el diseño predeterminado
  layoutsDir: __dirname + '/views/layouts' // Ubicación de los archivos de diseño
}));
app.set('view engine', 'handlebars');

// Conectar a MongoDB
connectDB();

// Middleware para procesar JSON y formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
app.use('/api', productsRouter);
app.use('/api', cartsRouter);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor iniciado en puerto ${PORT}`));
