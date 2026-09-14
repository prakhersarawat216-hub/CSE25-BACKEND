const express = require('express');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const categories = ['Electronics', 'Books', 'Home', 'Sports', 'Fashion'];
const products = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  category: categories[index % categories.length],
  price: Number((10 + index * 2.5).toFixed(2)),
  stock: 10 + (index * 7) % 91,
  description: `A reliable ${categories[index % categories.length].toLowerCase()} product.`
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Products REST API',
    productCount: products.length,
    endpoints: {
      list: 'GET /products',
      getOne: 'GET /products/:id',
      create: 'POST /products',
      update: 'PUT /products/:id',
      remove: 'DELETE /products/:id'
    }
  });
});

app.get('/products', (req, res) => {
  const { category } = req.query;
  const result = category
    ? products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    : products;

  res.json({ count: result.length, products: result });
});

app.get('/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, category, price, stock, description = '' } = req.body;

  if (!name || !category || typeof price !== 'number' || typeof stock !== 'number') {
    return res.status(400).json({
      error: 'name, category, numeric price, and numeric stock are required'
    });
  }

  const product = {
    id: products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1,
    name,
    category,
    price,
    stock,
    description
  };

  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const product = products.find((item) => item.id === Number(req.params.id));

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, category, price, stock, description } = req.body;
  Object.assign(product, {
    ...(name !== undefined && { name }),
    ...(category !== undefined && { category }),
    ...(price !== undefined && { price }),
    ...(stock !== undefined && { stock }),
    ...(description !== undefined && { description })
  });

  res.json(product);
});

app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex((item) => item.id === Number(req.params.id));

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const [deletedProduct] = products.splice(productIndex, 1);
  res.json({ message: 'Product deleted', product: deletedProduct });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Products API running at http://localhost:${PORT}`);
});
