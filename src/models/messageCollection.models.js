import mongoose from 'mongoose';

const messageCollectionSchema= new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,    
        ref:'User',
        required:true,
    },
    content:{
        type:String,
        trim:true,
        required:true,
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ChatCollection',
        required:true,
    },
    readBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }]
},{timestamps:true});
const MessageCollection= mongoose.model('MessageCollection', messageCollectionSchema);
export default MessageCollection;