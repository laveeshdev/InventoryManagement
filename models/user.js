import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim : true ,
        minlength: 3,
        maxlength: 50
    } ,
    username :{
        type: String,
        required: true,
        unique: true,
        trim : true ,
        minlength: 3,
        maxlength: 50
    }, 
    email : {
        type: String,
        required: true,
        unique: true,
        trim : true ,
        lowercase: true
    },
    password : {
        type: String,
        required: true,
        minlength: 8
    }
} , {timestamps: true});


const User = mongoose.model("User", userSchema);
export default User;
