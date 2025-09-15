import Party from '../models/party.js';

export const createParty = async (req , res ) => {
    try {
        const {name , email , phone , address , type , balance} = req.body ;
        const owner = req.user._id ; 
        const existParty = await Party.findOne({email}) ;
        if(existParty){
            return res.status(409).json({ message : "Party with this email already exists" }) ;
        }
        const party = await Party.create({name , email , phone , address , type , balance , owner}) ;

        res.status(201).json({ message : "Party created successfully" , party}) ;

    }
    catch (error) {
        res.status(500).json({ message : error.message }) ;
    }
} ;

export const getPartyById = async (req , res ) => {
    try {
        const {id} = req.params ;
        const party = await Party.findById(id) ;
        if(!party){
            return res.status(404).json({ message : "Party not found" }) ;
        }
        res.status(200).json(party) ;
    }
    catch (error) {
        res.status(500).json({ message : error.message }) ;
    }
} ;


export const getAllParties = async (req , res ) => {
    try {
        const parties = await Party.find({ owner: req.user._id }) ; 
        res.status(200).json({ parties }) ;
        
    } catch (error) {
        res.status(500).json({ message : error.message }) ;
        
    }
} ; 

export const deletePartyById = async (req, res) => {
    try {
        const {id} = req.params ; 
        const deletedParty = await Party.findByIdAndDelete(id) ;
        if(!deletedParty){
            res.status(404).json({ message : "Party not found" }) ;
        }

        res.status(200).json({ message : "Party deleted successfully" }) ;
        
    } catch (error) {
        res.status(500).json({ message : error.message }) ;
        
    }
} ; 

export const updatePartyById = async (req, res) => {
    try {
        const {id} = req.params ; 
        const updateData = req.body ;
        console.log(id) ; 
        console.log(updateData) ; 
        const findParty = await Party.findById(id) ;
        if(!findParty){
            return res.status(404).json({ message : "Party not found" }) ;
        }
        console.log(findParty) ;

        const updatedParty = await Party.findByIdAndUpdate(id , updateData , {new : true}) ;
        console.log(updatedParty) ;
        
        if(!updatedParty){
            res.status(404).json({ message : "Party not found" }) ;
        }

        res.status(200).json({ message : "Party updated successfully" , updatedParty}) ;
       
        
    } catch (error) {
        
    }
}




