import Party from '../models/party.js';

export const createParty = async (req , res ) => {
    try {
        const party = new Party(req.body) ;
        await party.save() ;
        res.status(201).json({ message : "Party created successfully" , party}) ;

    }
    catch (error) {
        res.status(500).json({ message : error.message }) ;
    }
} ;

export const getAllParties = async (req , res ) => {
    try {
        const parties = await Party.find() ; 
        res.status(200).json(parties) ;
        
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
        const updatedParty = await Party.findByIdAndUpdate(id , updateData , {new : true}) ;
        if(!updatedParty){
            res.status(404).json({ message : "Party not found" }) ;
        }
       
        
    } catch (error) {
        
    }
}




