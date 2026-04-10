import express from "express";
import {
  sendMessage,
  markMessageAsRead,
  markChatMessagesAsRead,
  deleteMessage,
} from "../controllers/messageCntrl.js";
import jwtCheck from "../config/jwtConfig.js";

const router = express.Router();

router.post("/send", jwtCheck, sendMessage);
router.put("/:messageId/read", jwtCheck, markMessageAsRead);
router.put("/chat/:chatId/read-all", jwtCheck, markChatMessagesAsRead);
router.delete("/:messageId", jwtCheck, deleteMessage);

export { router as messageRoute };
