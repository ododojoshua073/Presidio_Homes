import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Create a notification
export const createNotification = asyncHandler(async (req, res) => {
  const { receiverId, type, message, data } = req.body;
  const senderId = req.user.userId;

  if (!receiverId || !type || !message) {
    return res.status(400).json({ message: "receiverId, type, and message are required" });
  }

  try {
    const notification = await prisma.notification.create({
      data: {
        senderId,
        receiverId,
        type,
        message,
        data: data || {},
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error: error.message });
  }
});

// Get user notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { unreadOnly } = req.query;

  try {
    const where = { receiverId: userId };
    if (unreadOnly === "true") {
      where.isRead = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error: error.message });
  }
});

// Mark notification as read
export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error marking notification as read", error: error.message });
  }
});

// Mark all notifications as read
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    await prisma.notification.updateMany({
      where: {
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications as read", error: error.message });
  }
});

// Delete a notification
export const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification", error: error.message });
  }
});

// Delete all notifications
export const deleteAllNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    await prisma.notification.deleteMany({
      where: { receiverId: userId },
    });

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notifications", error: error.message });
  }
});
