import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import { createTransaction, deleteTransactionById, getAllTransactions, updateTransactionById } from "../controllers/transaction.controller.js";

const transactionRouter = Router();

transactionRouter.get('/' , authenticateToken , getAllTransactions);

transactionRouter.post('/add' , authenticateToken , createTransaction ) ;   
transactionRouter.put('/delete/:id' , authenticateToken , deleteTransactionById) ; 

transactionRouter.put('/update/:id' , authenticateToken , updateTransactionById) ;


export { transactionRouter };