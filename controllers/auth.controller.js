import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


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
        
       
        const token = jwt.sign({
            userId: newUser[0]._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,      // Set to true in production with HTTPS
            maxAge: 60 * 60 * 1000  // 1 hour
        });

        await session.commitTransaction() ; 
        session.endSession() ;

        res.status(201).json({
            success: true,
            message: 'Sign up successful!',
            data : {
                token,
                user: newUser[0] ,
            }

        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Error signing up user", error });
        
    }
}

export const login = async (req ,res) =>{
    const session = await mongoose.startSession() ; 
    session.startTransaction() ;
    try {
        const {username , password} = req.body ; 
        const user = await User.findOne({username}) ; 
        if(!user) {
            const error = new Error('User not found') ; 
            error.statusCode = 404 ;
            throw error ;
        }
        const savedPassword = user.password ;
        const isMatch = await bcrypt.compare(password , savedPassword) ;
        if(!isMatch) {
            const error = new Error('invalid credentials') ;
            error.statusCode = 401 ;
            throw error ;   
        }
        const token = jwt.sign({
            userId : user._id , 
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        // Set token as cookie
        res.cookie('token', token, {
            httpOnly: true,     // Prevents XSS attacks
            secure: false,      // Set to true in production with HTTPS
           sameSite: 'none' ,
            maxAge: 60 * 60 * 1000  // 1 hour in milliseconds
        });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: {
                token , 
                user: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
            }
        });

} catch (error){
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Error logging in user", error });
        return;
    }
}