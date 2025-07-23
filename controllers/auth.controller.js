import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';


export const signUp = async (req , res) => {
    const session = await mongoose.startSession() ; 
    session.startTransaction() ;
    try {
        const {name ,username, email , password} = req.body;
        const existUser = await User.findOne({username})
        if(existUser) {
            const error = new Error('user already exits') ; 
            error.statusCode = 409 ;
            throw error ;
        }
        const salt = await bcrypt.genSalt(10) ; 
        const hashedPassword = await bcrypt.hash(password , salt ) ; 

        const newUser = await User.create([{username , name , email , password: hashedPassword}], {session}) ;
        await session.commitTransaction() ; 
        session.endSession() ;

        res.status(201).json({
            success: true,
            message: 'Sign up successful!',
            data : {
                
                user:newUser[0] ,
            }

        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Error signing up user", error });
        
    }
}