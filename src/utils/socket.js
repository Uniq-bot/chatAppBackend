import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap={}


export const getRecieverSocketId=(userId)=>{
    return userSocketMap[userId];
}


io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
  const userId= socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId]=socket.id;
    }
    io.emit('onlineUsers', Object.keys(userSocketMap));
    // listen to group join from frontend
    socket.on('joinGroup',(groupId)=>{
        socket.join(groupId);
        console.log(`user ${userId} joined ${groupId} successfully`)
    })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    delete userSocketMap[userId];
    io.emit('onlineUsers', Object.keys(userSocketMap));
  });
});

export { io, server, app };
