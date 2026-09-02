import express from "express";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

const products = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: Number((Math.random() * 500 + 50).toFixed(2)),
  description: `This is the description for Product ${index + 1}.`,
}));

app.get("/", (req, res) => {
  const html = `<!DOCTYPE html>
  <html>
    <head>
      <title>Product API Tester</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 30px; background: #f4f6f8; }
        .container { max-width: 1100px; margin: auto; }
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 20px; }
        form { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
        input, button { padding: 10px; border-radius: 8px; border: 1px solid #d0d7de; }
        button { background: #2563eb; color: white; border: none; cursor: pointer; }
        button.delete { background: #dc2626; }
        button.update { background: #16a34a; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
        #status { margin-top: 10px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Product Management</h1>

        <div class="card">
          <h3>Add Product</h3>
          <form id="addForm">
            <input name="name" placeholder="Product Name" required />
            <input name="price" type="number" step="0.01" placeholder="Price" required />
            <input name="description" placeholder="Description" required />
            <button type="submit">Add Product</button>
          </form>
        </div>

        <div class="card">
          <h3>Update Product</h3>
          <form id="updateForm">
            <input name="id" type="number" placeholder="Product ID" required />
            <input name="name" placeholder="New Name" required />
            <input name="price" type="number" step="0.01" placeholder="New Price" required />
            <input name="description" placeholder="New Description" required />
            <button class="update" type="submit">Update Product</button>
          </form>
        </div>

        <div class="card">
          <h3>Product List</h3>
          <button id="loadProducts">Refresh Products</button>
          <div id="status"></div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="productTableBody"></tbody>
          </table>
        </div>
      </div>

      <script>
        const baseUrl = 'http://localhost:3000';
        const tableBody = document.getElementById('productTableBody');
        const statusBox = document.getElementById('status');

        function showStatus(message, isError = false) {
          statusBox.textContent = message;
          statusBox.style.color = isError ? '#dc2626' : '#15803d';
        }

        async function loadProducts() {
          try {
            const response = await fetch(baseUrl + '/products');
            const data = await response.json();
            tableBody.innerHTML = data.map(function(product) {
              return '<tr>' +
                '<td>' + product.id + '</td>' +
                '<td>' + product.name + '</td>' +
                '<td>$' + Number(product.price).toFixed(2) + '</td>' +
                '<td>' + product.description + '</td>' +
                '<td><button class="delete" data-id="' + product.id + '">Delete</button></td>' +
                '</tr>';
            }).join('');
            showStatus('Loaded ' + data.length + ' products');
          } catch (error) {
            showStatus('Error loading products', true);
          }
        }

        document.getElementById('addForm').addEventListener('submit', async function(event) {
          event.preventDefault();
          const form = event.target;
          const body = {
            name: form.name.value,
            price: Number(form.price.value),
            description: form.description.value,
          };

          try {
            const response = await fetch(baseUrl + '/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Creation failed');
            form.reset();
            showStatus('Product added: ' + data.name);
            loadProducts();
          } catch (error) {
            showStatus(error.message, true);
          }
        });

        document.getElementById('updateForm').addEventListener('submit', async function(event) {
          event.preventDefault();
          const form = event.target;
          const id = form.id.value;
          const body = {
            name: form.name.value,
            price: Number(form.price.value),
            description: form.description.value,
          };

          try {
            const response = await fetch(baseUrl + '/products/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Update failed');
            form.reset();
            showStatus('Product updated: ' + data.name);
            loadProducts();
          } catch (error) {
            showStatus(error.message, true);
          }
        });

        document.getElementById('productTableBody').addEventListener('click', async function(event) {
          const deleteButton = event.target.closest('.delete');
          if (!deleteButton) return;

          const id = deleteButton.dataset.id;
          try {
            const response = await fetch(baseUrl + '/products/' + id, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Delete failed');
            showStatus(data.message);
            loadProducts();
          } catch (error) {
            showStatus(error.message, true);
          }
        });

        document.getElementById('loadProducts').addEventListener('click', loadProducts);
        loadProducts();
      </script>
    </body>
  </html>`;

  res.send(html);
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

app.post("/products", (req, res) => {
  const { name, price, description } = req.body;

  if (!name || price === undefined || !description) {
    return res.status(400).json({
      message: "name, price and description are required",
    });
  }

  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name,
    price: Number(price),
    description,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, price, description } = req.body;

  products[productIndex] = {
    ...products[productIndex],
    name: name ?? products[productIndex].name,
    price: price !== undefined ? Number(price) : products[productIndex].price,
    description: description ?? products[productIndex].description,
  };

  res.json(products[productIndex]);
});

app.delete("/products/:id", (req, res) => {
  const productId = Number(req.params.id);
  const productIndex = products.findIndex((item) => item.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});