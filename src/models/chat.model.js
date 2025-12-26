import mongoose from "mongoose";

const chatSchema= new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    message:{
        type:String,
        trim:true,
        required:true,
    },
    image:{
        type:String,
        trim:true,
    }
    
},{timestamps:true});

const Chat= mongoose.model('Chat', chatSchema);
export default Chat;