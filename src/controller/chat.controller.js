import Chat from "../models/chat.model.js";
import cloudinary from "../utils/cloudinary.js";
import { getRecieverSocketId } from "../utils/socket.js";
import { io } from '../utils/socket.js';
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

    // real time via sockets can be implemented here
      const receiverSocketId = getRecieverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    return res
      .status(200)
      .json({ message: "Message sent successfully", newMessage });
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
    }).sort({ createdAt: 1 });
    res.status(200).json({ messages });
    console.log("messages", messages)
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
