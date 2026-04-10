import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";
import { chatRoute } from "./routes/chatRoute.js";
import { messageRoute } from "./routes/messageRoute.js";
import { notificationRoute } from "./routes/notificationRoute.js";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// Socket.io configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: ["https://mern-stack-real-estate-frontend.vercel.app", "http://localhost:5173"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  "https://mern-stack-real-estate-frontend.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS Request Origin:", origin);

      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        console.error("CORS Blocked:", cleanOrigin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/notification", notificationRoute);

app.get("/api/test", (req, res) => {
  console.log("TEST ENDPOINT HIT!");
  res.json({ message: "Server is working!" });
});

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a chat room
  socket.on("join-chat", (chatId) => {
    socket.join(`chat-${chatId}`);
    console.log(`User joined chat: ${chatId}`);
  });

  // Send message via socket
  socket.on("send-message", (data) => {
    const { chatId, message } = data;
    io.to(`chat-${chatId}`).emit("receive-message", message);
  });

  // Typing indicator
  socket.on("user-typing", (data) => {
    const { chatId, userName } = data;
    socket.broadcast.to(`chat-${chatId}`).emit("user-typing", { userName });
  });

  // Stop typing
  socket.on("stop-typing", (chatId) => {
    socket.broadcast.to(`chat-${chatId}`).emit("stop-typing");
  });

  // New notification
  socket.on("send-notification", (data) => {
    const { receiverId, notification } = data;
    io.to(`user-${receiverId}`).emit("receive-notification", notification);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server AFTER routes are defined
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

