import mongoose from 'mongoose';
import User from '../models/user.models.js';

export const getUserController = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('getUser error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const checkAuthController = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        return res.status(200).json({ 
            user,
            message: 'Authenticated' 
        });
    } catch (error) {
        console.error('checkAuth error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserByNameController = async (req, res) => {
    try {
        const name = req.params.name || req.query.name;
        const userId = req.user.id;
        
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Find users matching the name but exclude the current user
        const users = await User.find({ 
            name: { $regex: name, $options: "i" },
            _id: { $ne: userId }
        }).select('-password');

        return res.status(200).json({ user: users });
    } catch (error) {
        console.error('getUserByName error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};