import express from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notificationCntrl.js";
import jwtCheck from "../config/jwtConfig.js";

const router = express.Router();

router.post("/create", jwtCheck, createNotification);
router.get("/", jwtCheck, getNotifications);
router.put("/:notificationId/read", jwtCheck, markNotificationAsRead);
router.put("/read-all", jwtCheck, markAllNotificationsAsRead);
router.delete("/:notificationId", jwtCheck, deleteNotification);
router.delete("/", jwtCheck, deleteAllNotifications);

export { router as notificationRoute };
