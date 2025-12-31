import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import {io, server, app} from './utils/socket.js';
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://192.168.56.1:3000",
      "https://chat-app-frontend-fmic.vercel.app"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.set('io', io);

const PORT = process.env.PORT || 5000;


//connect to database
import {connectDB} from './config/connect.DB.js';
connectDB();

// login routes
import authRoutes from './routes/auth.routes.js';
app.use('/api/auth', authRoutes);
// register routes
app.use('/api/auth', authRoutes);


// get user routes
import getUserRoutes from './routes/getUser.routes.js';
app.use('/api', getUserRoutes);
// message routes
import messageRoutes from './routes/chat.routes.js';
app.use('/api', messageRoutes);

//group search routes
import getGroupRoutes from './routes/getGroup.routes.js';
app.use('/api/groups', getGroupRoutes);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

