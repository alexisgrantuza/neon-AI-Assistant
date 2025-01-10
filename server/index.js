const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");
const sessionMiddleware = require("./middleware/session");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(sessionMiddleware);

// Connect to database
connectDB();

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/chat", require("./routes/chatRoutes"));
app.use("/audio", require("./routes/audioRoutes"));
app.use("/stats", require("./routes/statsRoutes"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
