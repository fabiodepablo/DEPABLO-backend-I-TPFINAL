const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

// Obtener todos los carritos
router.get('/carts', async (req, res) => {
  const carts = await Cart.find({}).populate('products.product');
  res.json(carts);
});

// Crear un nuevo carrito
router.post('/carts', async (req, res) => {
  const newCart = new Cart({ products: [] });
  await newCart.save();
  res.json({ status: 'success', message: 'Carrito creado', cart: newCart });
});

// Agregar un producto a un carrito
router.post('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findById(cid);
  const existingProduct = cart.products.find(p => p.product.toString() === pid);

  if (existingProduct) {
    existingProduct.quantity += Number(quantity);
  } else {
    cart.products.push({ product: pid, quantity: Number(quantity) });
  }

  await cart.save();
  res.json({ status: 'success', message: 'Producto agregado al carrito', cart });
});

// Actualizar la cantidad de un producto en el carrito
router.put('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findById(cid);
  const product = cart.products.find(p => p.product.toString() === pid);

  if (product) {
    product.quantity = quantity;
    await cart.save();
    res.json({ status: 'success', message: 'Cantidad de producto actualizada', cart });
  } else {
    res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
  }
});

// Eliminar un producto del carrito
router.delete('/carts/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  const cart = await Cart.findById(cid);
  cart.products = cart.products.filter(p => p.product.toString() !== pid);

  await cart.save();
  res.json({ status: 'success', message: 'Producto eliminado del carrito', cart });
});

// Eliminar todos los productos del carrito
router.delete('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  const cart = await Cart.findById(cid);
  cart.products = [];

  await cart.save();
  res.json({ status: 'success', message: 'Todos los productos eliminados del carrito', cart });
});

module.exports = router;
