import mongoose from "mongoose";
import User from "../models/user.js";
import Listing from "../models/listing.js";


export const createListing = async (req , res ) => {
    try {
        const {name , type , sku , image_url , description, quantity, price} = req.body;
        const owner = req.user._id;
        const existListing = await Listing.findOne({sku}) ; 
        if(existListing) {
            return res.status(409).json({ message: 'Listing with this SKU already exists' });
        }

        const newListing = await Listing.create({
            owner , name , type , sku , image_url , description, quantity, price
        })

        
        res.status(201).json({
            success: true,
            message: 'Listing created successfully',
            data: newListing
        });






    } catch (error) {
        res.status(500).json({ message: "Error creating listing", error });
        
    }

}

export const getAllListings = async (req, res) => {
    try {
        const userId = req.user._id ; 
        console.log("User ID:", userId);
        const listings = await Listing.find({owner : userId}).populate('owner', 'username name email -_id');
        res.status(200).json({
            success: true,
            message: 'Listings retrieved successfully',
            data: listings
        });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving listings", error });
    }
}

export const getListingById = async (req , res) =>{
    const {id} =  req.params ; 
    try {
        const listing = await Listing.findById(id).populate('owner' , 'username name email -_id');
        if(!listing) {  
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Listing retrieved successfully',
            data: listing
        });
        
    } catch (error) {
        res.status(500).json({ message: "Error retrieving listing", error });
        
    }
}

export const updateListingQunantity = async (req, res) => {
    const {id}  = req.params ; 
    const {quantity} = req.body ; 

    try {
        const listing = await Listing.findByIdAndUpdate(id , 
            {quantity},
            {new : true},
        ).populate('owner', 'username name email -_id');
        if(!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Listing quantity updated successfully',
            data: listing
        });
        
    } catch (error) {
        res.status(500).json({ message: "Error updating listing quantity", error });
        
    }
}

export const deleteListingById = async (req, res) => {
    const { id } = req.params;
    try {
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: "Error deleting listing", error });
    }
}