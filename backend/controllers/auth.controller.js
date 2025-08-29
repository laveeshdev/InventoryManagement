import mongoose from "mongoose";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const signUp = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const existUser = await User.findOne({ username });
        if (existUser) {
            const error = new Error('user already exits');
            error.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ username, name, email, password: hashedPassword });

        const token = jwt.sign({
            userId: newUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,      // Set to true in production with HTTPS
            maxAge: 60 * 60 * 1000  // 1 hour
        });

        res.status(201).json({
            success: true,
            message: 'Sign up successful!',
            data: {
                token,
                user: newUser,
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error signing up user", error });
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const savedPassword = user.password;
        const isMatch = await bcrypt.compare(password, savedPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({
            userId: user._id,
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // Set token as cookie
        res.cookie('token', token, {
            httpOnly: true,     // Prevents XSS attacks
            secure: true,      // Set to true in production with HTTPS
            sameSite: 'none',
            maxAge: 60 * 60 * 1000  // 1 hour in milliseconds
        });

        res.status(200).json({
            success: true,
            message: "Login successful!",
            data: {
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in user", error });
    }
}