import Chat from "../models/chat.model.js";
import cloudinary from "../utils/cloudinary.js";
export const sendChatMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user.id;
    const { id: receiverId } = req.params;
    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }
    let imageUrl = null;
    if (image) {
      // send image to cloudinary and get the url
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "chatApp/images",
        resource_type: "image",
      });
      imageUrl = uploadRes.secure_url;
    }
    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message: text,
      image: imageUrl,
    });
    await newMessage.save();

    // real time via sockets can be implemented here

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
          receiverId: userTochatId,
        },
        {
          senderId: userTochatId,
          receiverId: myId,
        },
      ],
    });
    res.status(200).json({ messages });
    console.log(messages)
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
