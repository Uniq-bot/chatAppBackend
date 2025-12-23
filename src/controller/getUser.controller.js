import mongoose from 'mongoose';
import User from '../models/user.models.js';

export const getUserController = async (req, res) => {
    try {
        const userName = req.params.id

        if (!userName) {
            return res.status(400).json({ message: 'User name is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(userName)) {
            return res.status(400).json({ message: 'Invalid user name' });
        }

        const user = await User.findById(userName).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('getUser error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const checlAuthController=async (req, res)=>{
    try {
        const userId= req.user.id;
        const user= await User.findById(userId).select('-password');
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({user: user,
            message: 'Authenticated'
        });
    } catch (error) {
        console.error('checkAuth error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}
export const getAllUsersController = async (req, res) => {
    try {
        const currUser= req.user.id;
        const users = await User.find({ _id: { $ne: currUser } }).select('-password');
        return res.status(200).json({ users });
    } catch (error) {
        console.error('getAllUsers error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserByNameController = async (req, res) => {
    try {
        const name = req.params.name || req.query.name;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ message: 'Name is required' });
        }

        const user = await User.findOne({ name }).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('getUserByName error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};