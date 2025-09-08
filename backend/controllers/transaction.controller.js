import Transaction from "../models/transaction.js";


export const createTransaction = async (req , res) => {
    try {
        const {  party , items ,paymentStatus , amount , type , invoice , date , remarks } = req.body ;


        if(!owner || !party || !items || !amount || !type || !invoice ){
            return res.status(400).json({ message : "All fields are required" }) ;
        }
        const owner = req.user._id ;
        const newtransaction = new Transaction({
            owner,
            party,
            items,
            paymentStatus,
            amount,
            type,
            invoice,
            date,
            remarks
        });

        await newtransaction.save() ; 
        res.status(201).json({ message : "Transaction created successfully" , transaction : newtransaction }) ;

    } catch (error) {
        res.status(200).json({ message : error.message }) ;
        
    }
}

export const getAllTransactions = async (req , res) => {
    try {
        const transactions = await Transaction.find({ owner: req.user._id });
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
