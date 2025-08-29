import mongoose from "mongoose" ; 
import Party from "./party.js"; 


const transactionSchema = new mongoose.Schema({
    party : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "Party" ,
        required : true
    } ,
    items : {
        type : [mongoose.Schema.Types.ObjectId] ,
        ref : "Listing" ,
        required : true
    } ,
    paymentStatus : {
        type : String ,
        enum : ["pending" , "completed" ] ,
        default : "pending"
    } , 
    amount : {
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

const Transaction = mongoose.model("Transaction" , transactionSchema) ;

export default Transaction;
