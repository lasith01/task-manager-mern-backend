const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes= require('./routes/taskRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use('/api/auth', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));