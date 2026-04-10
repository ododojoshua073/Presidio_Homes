import express from "express";
import {
  createChat,
  getUserChats,
  getAgentChats,
  getChat,
  closeChat,
} from "../controllers/chatCntrl.js";
import jwtCheck from "../config/jwtConfig.js";

const router = express.Router();

router.post("/create", jwtCheck, createChat);
router.get("/user", jwtCheck, getUserChats);
router.get("/agent", jwtCheck, getAgentChats);
router.get("/:chatId", jwtCheck, getChat);
router.put("/:chatId/close", jwtCheck, closeChat);

export { router as chatRoute };
