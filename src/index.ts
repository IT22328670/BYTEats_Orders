import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

