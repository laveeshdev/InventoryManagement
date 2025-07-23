import express from 'express';
import dotenv from 'dotenv';
import connectionToDatabase from './config/connectionDb.js';
import config from './config/env.js';
import { authRouter } from './routes/auth.route.js';


dotenv.config();
const app = express(); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/product', productRouter);





app.get('/' , (req,res)=>{
    res.send("Welcome to the Inventory Management System");
})

app.listen(process.env.PORT || 3000 , ()=>{
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    connectionToDatabase();
});