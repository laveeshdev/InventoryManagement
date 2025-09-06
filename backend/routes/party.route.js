import { Router } from "express";
import { createParty } from "../controllers/party.controller.js";
import { authenticateToken } from "../middleware/auth.js";


const partyRouter = Router();

partyRouter.get('/' , (req, res) => {
    res.send("get parties ");
});

partyRouter.post('/add' ,authenticateToken, createParty) ;

partyRouter.put('/delete/:id' , (req , res) => {
    res.send("delete party") ;
})

partyRouter.put('/update/:id' , (req , res) => {
    res.send("update party") ;
}) ;

partyRouter.get('/:id' , (req , res) => {
    res.send("get party by id") ;
}) ;



export { partyRouter };