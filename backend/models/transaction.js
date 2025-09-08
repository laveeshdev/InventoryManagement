import mongoose from "mongoose" ; 
import Party from "./party.js"; 


const transactionSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "User" , 
        required : true
    },
    party : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Party" ,
        required : true
    } ,
    items : [
        {
            listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
            quantity: { type: Number, required: true },
            amount: { type: Number, required: true }
        }
    ] ,
    paymentStatus : {
        type : String ,
        enum : ["pending" , "completed" ] ,
        default : "pending"
    } , 
    totalAmount : {
        type : Number ,
        required : true
    } , 
    type : {
        type : String , 
        enum : ["buy" , "sell"] , 
        default : "sell" ,
        required : true 
    } , 
    invoice : {
        type : String ,
        required : true
    } ,
    date : {
        type : Date ,
        default : Date.now
    } , 
    remarks : {
        type : String ,
        required : false
    }


}) ; 

transactionSchema.pre('save' , async function(next) {
    let total = 0 ; 
    this.items.forEach(item => {
        total += item.amount * item.quantity ;
    })

    this.totalAmount = total ;
    next() ;
}) ; 

const Transaction = mongoose.model("Transaction" , transactionSchema) ;

export default Transaction;
