import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createTransaction, getAllTransactions } from "../controllers/transaction.controller.js";

const transactionRouter = Router();

transactionRouter.get('/' , authenticateToken , getAllTransactions);

transactionRouter.post('/add' , authenticateToken , createTransaction ) ;   
transactionRouter.put('/delete/:id' , (req , res) => {
    res.send("delete transaction") ;
}) ; 

transactionRouter.put('/update/:id' , (req , res) => {
    res.send("update transaction") ;
}) ;


export { transactionRouter };