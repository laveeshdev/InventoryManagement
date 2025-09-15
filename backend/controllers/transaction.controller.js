import Transaction from "../models/transaction.js";


export const createTransaction = async (req , res) => {
    try {
        console.log("hi from createTransaction");
        
        const {  party , items ,paymentStatus , type , invoice , date , remarks } = req.body ;


        const owner = req.user._id ;
        const ownerName = req.user.name ;
        console.log(owner , party , items , type , invoice , date ,remarks ) ;
        
        if(!owner || !party || !items || !type || !invoice ){
            return res.status(400).json({ message : "All fields are required" }) ;
        }

        let totalAmount = 0;
        if (items && items.length > 0) {
            totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.amount), 0);
        }

        const newtransaction = new Transaction({
            owner,
            ownerName, 
            
            party,
             
            items,
            paymentStatus,
            totalAmount,
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
        console.log("hello form get all transaction of owner ");
        
        const transactions = await Transaction.find({ owner: req.user._id }).populate('party');
        console.log(transactions);
        
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTransactionById = async (req , res) => {
    try {
        const {id} = req.params ; 
        const transaction = await Transaction.findByIdAndDelete(id) ;
        if(!transaction){
            return res.status(404).json({ message : "Transaction not found" }) ;
        }
        res.status(200).json({ message : "Transaction deleted successfully" }) ;

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
} ; 

export const updateTransactionById = async (req , res) => {
    const {id} = req.params ;
    const updatedData = req.body ; 
    const transaction = await Transaction.findByIdAndUpdate(id , updatedData , {new : true}) ;
    if(!transaction){
        return res.status(404).json({ message : "Transaction not found" }) ;
    }
}
    