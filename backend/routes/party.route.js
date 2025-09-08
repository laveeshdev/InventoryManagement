import { Router } from "express";
import { createParty, deletePartyById, getAllParties, getPartyById, updatePartyById } from "../controllers/party.controller.js";
import { authenticateToken } from "../middleware/auth.js";


const partyRouter = Router();

partyRouter.get('/' , authenticateToken , getAllParties);

partyRouter.post('/add' ,authenticateToken , createParty) ;

partyRouter.delete('/delete/:id' ,authenticateToken , deletePartyById)

partyRouter.put('/update/:id' , authenticateToken , updatePartyById) ;

partyRouter.get('/:id' , authenticateToken , getPartyById) ;



export { partyRouter };