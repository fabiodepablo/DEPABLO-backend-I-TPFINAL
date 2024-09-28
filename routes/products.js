const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// Renderizar el formulario para agregar productos
router.get('/products/new', (req, res) => {
  res.render('addProduct'); // Renderiza la vista addProduct.handlebars
});

// Procesar el formulario para agregar un nuevo producto
router.post('/products', async (req, res) => {
  const { title, description, price, category, available } = req.body;
  const newProduct = new Product({
    title,
    description,
    price,
    category,
    available: available === 'true' // Convertir checkbox a booleano
  });
  await newProduct.save();
  res.redirect('/api/products'); // Redirige a la lista de productos después de agregar uno
});

// Obtener productos con filtros, paginación y ordenamiento
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  let filter = {};

  if (query) {
    filter = { title: new RegExp(query, 'i') };
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .limit(Number(limit))
    .skip((page - 1) * limit)
    .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : {});

  res.json({
    status: 'success',
    payload: products,
    totalPages: Math.ceil(total / limit),
    prevPage: page > 1 ? page - 1 : null,
    nextPage: page < Math.ceil(total / limit) ? page + 1 : null,
    page: Number(page)
  });
});

// Obtener un producto por ID
router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener el producto' });
  }
});

module.exports = router;
