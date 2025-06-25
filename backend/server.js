const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cookieSession = require('cookie-session');
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const teamMemberRoutes = require("./routes/teamMemberRoutes");
const path = require('path');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://xzc.netlify.app'
];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: [process.env.COOKIE_SECRET || 'a_default_secret_key'],
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'none',
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);
app.use("/reports", reportRoutes);
app.use("/notifications", notificationRoutes);
app.use("/events", eventRoutes);
app.use("/team-members", teamMemberRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});