import Chat from "../models/chat.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getRecieverSocketId } from "../utils/socket.js";
import { io } from '../utils/socket.js';
import { GroupChat } from "../models/groupChat.model.js";
export const sendGroupMessage= async (req, res) => {
  try {
    const {content}= req.body;
    const senderId= req.user.id;
    const {groupId}= req.params;
    if(!content){
        return res.status(400).json({message:"Message content is required"});
    }
    const newMessage= new GroupChat({
        senderId: senderId,
        groupId: groupId,
        content: content,
    });
    await newMessage.save();
    
    // Populate sender info before sending
    const populatedMessage = await newMessage.populate('senderId', 'name pic email');
    
    // Broadcast to all users in the group room
    console.log(`Broadcasting to group ${groupId}:`, populatedMessage);
    io.to(groupId).emit("newGroupMessage", populatedMessage);
    return res.status(200).json({message:"Message sent successfully", newMessage: populatedMessage});

  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Internal Server Error", error: error.message})
    
  }
}

export const getGroupMessagesOfID=async (req, res)=>{
    try {
      const {groupId}= req.params;
      if(!groupId){
          return res.status(400).json({message:"Group ID is required"});
      }
      const messages= await GroupChat.find({groupId: groupId})
        .populate('senderId', 'name pic email')
        .sort({createdAt: 1});
      res.status(200).json({messages});
      console.log("group messages", messages)
      
    } catch (error) {
      console.log(error)
      res.status(500).json({message:"Internal Server Error", error: error.message})
      
    }
}
export const sendChatMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const senderId = req.user.id;
    const { id: receiverId } = req.params;
    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }
   
    const newMessage = new Chat({
      senderId: senderId,
      receiver: receiverId,
      message: text,
    });
    await newMessage.save();

    // Populate sender info
    const populatedMessage = await newMessage.populate('senderId', 'name pic email');

    // real time via sockets - send to both sender and receiver
    const receiverSocketId = getRecieverSocketId(receiverId);
    const senderSocketId = getRecieverSocketId(senderId);
    
    console.log(`Sender: ${senderId} (socket: ${senderSocketId}), Receiver: ${receiverId} (socket: ${receiverSocketId})`);
    
    // Send to receiver
    if (receiverSocketId) {
      console.log(`Sending message to receiver ${receiverId} via socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }
    
    // Send to sender so they see their own message in real-time
    if (senderSocketId) {
      console.log(`Sending message to sender ${senderId} via socket ${senderSocketId}`);
      io.to(senderSocketId).emit("newMessage", populatedMessage);
    }
    
    return res
      .status(200)
      .json({ message: "Message sent successfully", newMessage: populatedMessage });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getMessagesOfID = async (req, res) => {
  try {
    const { id: userTochatId } = req.params;
    const myId = req.user.id;
    if (!userTochatId) {
      return res
        .status(400)
        .json({ message: "User ID to chat with is required" });
    }
    const messages = await Chat.find({
      $or: [
        {
          senderId: myId,
          receiver: userTochatId,
        },
        {
          senderId: userTochatId,
          receiver: myId,
        },
      ],
    })
    .populate('senderId', 'name pic email')
    .sort({ createdAt: 1 });
    res.status(200).json({ messages });
    console.log("messages", messages)
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
