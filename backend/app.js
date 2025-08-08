require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/projects', require('./routes/project'));
app.use('/api/stages', require('./routes/stage'));
app.use('/api/tasks', require('./routes/task'));
app.use('/api/payments', require('./routes/payment'));
app.use('/api/users', require('./routes/user'));
const fileRoutes = require('./routes/file');
app.use('/api/files', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 