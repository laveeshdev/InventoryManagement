import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    name:{
        type : String,
        required: true, 
        trim: true,

    } ,
    type : {
        type: String,
        required: true,
        
    } , 
    sku :{
        type: String,
        required: true,
        unique: true, 
        trim: true,
        uppercase: true
    } , 
    image_url :{
        type : String,
    } , 
    description : {
        type: String,
        maxlength: 500,
        
    } ,
    quantity : {
        type: Number,
        required: true,
        min: 0 
    } ,   
    price : {
        type : Number,
        required: true,
    }
}, {
    timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;

