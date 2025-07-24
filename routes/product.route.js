import Router from 'express';

const productRouter = Router();

productRouter.post('/add', (req, res) => {
    // Logic to add a product
    res.status(201).json({ message: 'Product added successfully' });
});

productRouter.get('/list', (req, res) => {
    // Logic to list products
    res.status(200).json({ message: 'Product list retrieved successfully' });
});

productRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    // Logic to get a product by ID
    res.status(200).json({ message: `Product with ID ${id} retrieved successfully` });
});

productRouter.put('/:id/quantity', (req, res) => {
    
    res.status(200).json({ message: `Product with ID ${id} quantity updated to ${quantity}` });
});

export default productRouter;