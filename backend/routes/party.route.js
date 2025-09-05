import { Router } from "express";
const partyRouter = Router();

partyRouter.get('/' , (req, res) => {
    res.send("get parties ");
});

partyRouter.post('/add' , (req ,res) => {
    res.send("add party") ; 
}) ;

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