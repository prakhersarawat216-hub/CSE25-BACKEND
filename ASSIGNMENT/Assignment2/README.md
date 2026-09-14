# Assignment 2: Products REST API

An Express.js REST API with 100 products generated when the server starts.

## Setup

```bash
npm install
npm start
```

The API runs at `http://localhost:3000`.

## Routes

- `GET /products` - returns all products
- `GET /products/:id` - returns one product
- `GET /products?category=Books` - filters by category
- `POST /products` - creates a product
- `PUT /products/:id` - updates a product
- `DELETE /products/:id` - deletes a product

Example request body for `POST /products`:

```json
{
  "name": "Wireless Keyboard",
  "category": "Electronics",
  "price": 29.99,
  "stock": 25,
  "description": "A compact wireless keyboard"
}
```
