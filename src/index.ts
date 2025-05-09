import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import orderRoute from './routes/order.route';
import connectDB from '../src/config/dbConnect';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use('/api/order', orderRoute);

app.get("/", (req,res) => {
  res.send("Order Backend is running...");
});

// CREATE HTTP SERVER
const server = http.createServer(app);

// INITIALIZE SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// SOCKET.IO EVENTS
io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Join a room for a specific order
  socket.on("join_order", (orderId) => {
    socket.join(orderId);
    console.log(`Socket ${socket.id} joined order ${orderId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// Make io available to controllers
export { io };

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
