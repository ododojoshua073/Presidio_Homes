import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, receiverId, content } = req.body;
  const senderId = req.user.userId;

  if (!chatId || !receiverId || !content) {
    return res.status(400).json({ message: "chatId, receiverId, and content are required" });
  }

  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        receiverId,
        content,
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

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
});

// Mark message as read
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error marking message as read", error: error.message });
  }
});

// Mark all messages in a chat as read
export const markChatMessagesAsRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    await prisma.message.updateMany({
      where: {
        chatId,
        isRead: false,
      },
      data: { isRead: true },
    });

    res.status(200).json({ message: "All messages marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking messages as read", error: error.message });
  }
});

// Delete a message
export const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await prisma.message.delete({
      where: { id: messageId },
    });

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting message", error: error.message });
  }
});
