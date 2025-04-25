import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from '../src/config/dbConnect';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("API is running...");
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});

