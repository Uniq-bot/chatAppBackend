import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app = express();
app.use(
  cors({
       origin: [
      "http://localhost:3000",
      "http://172.28.16.1:3000"
    ],
    credentials: true,              // allow cookies
  })
);
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

