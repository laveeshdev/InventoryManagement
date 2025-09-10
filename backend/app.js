import express from 'express';
import dotenv from 'dotenv';
import connectionToDatabase from './config/connectionDb.js';
import config from './config/env.js';
import { authRouter } from './routes/auth.route.js';
import { productRouter } from './routes/product.route.js';
import { partyRouter } from './routes/party.route.js';
import { transactionRouter } from './routes/transaction.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';



dotenv.config();
const app = express(); 
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:8080','https://inventorymanagement-front.onrender.com'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/party' , partyRouter);
app.use('/api/v1/transaction' , transactionRouter);


app.get('/' , (req,res)=>{
    res.send("Welcome to the Inventory Management System");
})

app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    connectionToDatabase();
});