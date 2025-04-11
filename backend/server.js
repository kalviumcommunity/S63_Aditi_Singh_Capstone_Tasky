const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');

// const taskRoutes = require('./routes/taskRoutes');
// const userRoutes = require('./routes/userRoutes');
// const reportRoutes = require('./routes/reportRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// app.use('/api/tasks', taskRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
