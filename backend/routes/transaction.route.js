 import { Router } from "express";

const transactionRouter = Router();

transactionRouter.get('/' , (req, res) => {
    res.send("get transactions ");
});

transactionRouter.post('/add' , (req ,res) => {
    res.send("add transaction") ; 
}) ;   
transactionRouter.put('/delete/:id' , (req , res) => {
    res.send("delete transaction") ;
}) ; 

transactionRouter.put('/update/:id' , (req , res) => {
    res.send("update transaction") ;
}) ;


export { transactionRouter };