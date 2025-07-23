import mongoose from "mongoose";
;



export const connectionToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the database successfully");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        
    }
};

export default connectionToDatabase;