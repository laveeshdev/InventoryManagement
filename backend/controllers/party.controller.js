import Party from '../models/party.model.js';

export const createParty = async (req , res ) => {
    try {
        const party = new Party(req.body) ;
        await party.save() ;
        res.status(201).json({ message : "Party created successfully" , party}) ;

    }
    catch (error) {
        res.status(500).json({ message : error.message }) ;
    }
}