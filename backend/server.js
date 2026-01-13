const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'products_orders.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read data from file
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { products: [], orders: [] };
  }
};

// Helper function to write data to file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

// GET /api/data - Return all products and orders
app.get('/api/data', (req, res) => {
  try {
    const data = readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

// PUT /api/products/:id - Update a specific product
app.put('/api/products/:id', (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { title, category, unitPrice, cogs } = req.body;

    // Validation
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
      return res.status(400).json({ error: 'Unit price must be a number greater than 0' });
    }

    if (typeof cogs !== 'number' || cogs <= 0) {
      return res.status(400).json({ error: 'COGS must be a number greater than 0' });
    }

    const data = readData();
    const productIndex = data.products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update product
    data.products[productIndex] = {
      ...data.products[productIndex],
      title,
      category,
      unitPrice,
      cogs
    };

    // Save to file
    if (writeData(data)) {
      res.json(data.products[productIndex]);
    } else {
      res.status(500).json({ error: 'Failed to save product' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/products - Add a new product
app.post('/api/products', (req, res) => {
  try {
    const { title, category, unitPrice, cogs } = req.body;

    // Validation
    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category are required' });
    }

    if (typeof unitPrice !== 'number' || unitPrice <= 0) {
      return res.status(400).json({ error: 'Unit price must be a number greater than 0' });
    }

    if (typeof cogs !== 'number' || cogs <= 0) {
      return res.status(400).json({ error: 'COGS must be a number greater than 0' });
    }

    const data = readData();
    
    // Generate new ID
    const newId = data.products.length > 0 
      ? Math.max(...data.products.map(p => p.id)) + 1 
      : 1;

    const newProduct = {
      id: newId,
      title,
      category,
      unitPrice,
      cogs
    };

    data.products.push(newProduct);

    // Save to file
    if (writeData(data)) {
      res.status(201).json(newProduct);
    } else {
      res.status(500).json({ error: 'Failed to save product' });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/data`);
  console.log(`  PUT  http://localhost:${PORT}/api/products/:id`);
  console.log(`  POST http://localhost:${PORT}/api/products`);
});
