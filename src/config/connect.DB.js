import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const uri = process.env.DB_URI;
        if (!uri) {
            throw new Error('Missing DB_URI in environment');
        }
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error in DB connection:', error.message);
        throw error;
    }
};