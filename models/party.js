import mongoose from "mongoose" ; 

const partiesSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : true , 
        trim : true 
    },
    email : {
        type : String ,
        required : true ,
        trim : true ,
        unique : true
    } , 
    phone : {
        type : Number ,
        required : true ,
        trim : true ,
        unique : true
    } , 
    address :{
        type : String , 
        trim : true 

    } ,
    type : {
        type : String ,
        enum : ['customer', 'seller'],
        default : 'customer'
    } , 
    balance : {
        type : Number ,
        required : true ,
        default : 0
    }

}) ;

const Party  = mongoose.model('Party' , partiesSchema) ;

export default Party ;

