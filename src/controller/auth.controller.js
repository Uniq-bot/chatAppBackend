import User from '../models/user.models.js';
import { generateToken } from '../utils/generateToken.js';
import cloudinary from '../utils/cloudinary.js';
export const registerUser= async(req, res)=>{
        try {
            const {name, email, password, image}= req.body;
            const existingUser= await User.findOne({email});
            if(existingUser){
                return  res.status(400).send({message: "User already exists"});
            }
            
            const newUser= new User({name, email, password, image});
            await newUser.save();
            const token= generateToken(newUser);
            res.status(201).send({message: "User registered successfully", user: newUser, token});
            console.log(token);
            
        } catch (error) {
            res.status(500).send({message: "Error in registering user", error: error.message});
            console.log(error)
            
        }    
}

export const loginUser= async(req, res)=>{
    try {
        const {email, password}= req.body;
        
        const user= await User.findOne({email});
        if(!user || !(await user.matchPassword(password))){
            return res.status(400).send({message: "Invalid email or password"});
        }
        const token= generateToken(user);
        res.status(200).send({message: "User logged in successfully", user, token});
        
    } catch (error) {
        res.status(500).send({message: "Error in logging in user", error: error.message});
        console.log(error)
    }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    const uploadRes = await cloudinary.uploader.upload(base64Image, {
      folder: "profile_pics",
      width: 150,
      crop: "scale",
    });

    user.pic = uploadRes.secure_url;
    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error in updating profile",
      error: error.message,
    });
  }
};
