import express from 'express';
import dotenv from 'dotenv';
import connectionToDatabase from './config/connectionDb.js';
import config from './config/env.js';
import { authRouter } from './routes/auth.route.js';
import { productRouter } from './routes/product.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';


dotenv.config();
const app = express(); 
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','https://inventorymanagement-front.onrender.com'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management API',
      version: '1.0.0',
      description: 'API documentation for Inventory Management System',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local server' },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);






app.get('/' , (req,res)=>{
    res.send("Welcome to the Inventory Management System");
})

app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    connectionToDatabase();
});