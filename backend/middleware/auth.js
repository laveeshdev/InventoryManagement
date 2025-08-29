import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. User not found.'
            });
        }

        // Add user to request object
        req.user = user;
        next(); // Continue to the next middleware/route handler

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error in authentication.',
            error: error.message
        });
    }
};

// Optional middleware - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            req.user = user;
        }

        next(); // Continue regardless of token presence
    } catch (error) {
        // Continue without setting req.user if token is invalid
        next();
    }
};
