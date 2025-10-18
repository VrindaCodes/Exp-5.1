const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/productsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Product Schema & Model
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);

// CRUD Routes

// GET all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new product
app.post('/products', async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const product = new Product({ name, price, category });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update a product by ID
app.put('/products/:id', async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, category },
            { new: true, runValidators: true }
        );
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a product by ID
app.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.status(200).json({ message: "Product deleted", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(3000, () => console.log('Server started on port 3000'));
