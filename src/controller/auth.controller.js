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
import { Group } from '../models/group.model.js';
export const createGroup=async(req, res)=>{
    try {
      const {name}= req.body;
      const userId= req.user.id;
      
      let imageUrl = null;
      
      // Upload image to cloudinary if provided
      if (req.file) {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "group_images",
        });
        imageUrl = uploadResult.secure_url;
      }
      
      const newGroup= new Group({
          name: name,
          image: imageUrl,
          members: [userId],
          admin: userId,
      });
      await newGroup.save();
      res.status(201).send({message: "Group created successfully", group: newGroup});


      
    } catch (error) {
      res.status(500).send({message: "Error in creating group", error: error.message});
      console.log(error)
      
    }
}

export const joinGroup= async(req, res)=>{
    try {
      const {groupId}= req.params;
      const userId= req.user.id;
      const group= await Group.findById(groupId);
      if(!group){
          return res.status(404).send({message: "Group not found"});
      }
      if(group.members.includes(userId)){
          return res.status(400).send({message: "User already a member of the group"});
      }
      group.members.push(userId);
      await group.save();
      res.status(200).send({message: "Joined group successfully", group});
    } catch (error) {
      res.status(500).send({message: "Error in joining group", error: error.message});
      console.log(error);
    }
}

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
