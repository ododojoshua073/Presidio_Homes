import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

// Create or get chat
export const createChat = asyncHandler(async (req, res) => {
  const { propertyId, agentEmail } = req.body;
  const userId = req.user.userId;

  if (!propertyId || !agentEmail) {
    return res.status(400).json({ message: "propertyId and agentEmail are required" });
  }

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Verify property exists
    const property = await prisma.residency.findUnique({
      where: { id: propertyId },
    });
    
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    
    // Verify agent exists
    const agent = await prisma.user.findUnique({
      where: { email: agentEmail },
    });
    
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Check if chat already exists
    let chat = await prisma.chat.findFirst({
      where: {
        propertyId,
        userId,
        agentEmail,
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          propertyId,
          userId,
          agentEmail,
        },
      });
    }

    res.status(201).json(chat);
  } catch (error) {
    console.error("Chat creation error:", error);
    res.status(500).json({ message: "Error creating chat", error: error.message });
  }
});

// Get all chats for a user
export const getUserChats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    
    // Fetch all agents at once (avoid N+1 queries)
    const uniqueAgentEmails = [...new Set(chats.map((chat) => chat.agentEmail))];
    const agents = await prisma.user.findMany({
      where: {
        email: {
          in: uniqueAgentEmails,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    // Create email to agent map for fast lookup
    const agentMap = new Map(agents.map((agent) => [agent.email, agent]));

    // Attach agents to chats
    const chatsWithAgent = chats.map((chat) => ({
      ...chat,
      agent: agentMap.get(chat.agentEmail),
    }));

    res.status(200).json(chatsWithAgent);
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({ message: "Error fetching chats", error: error.message });
  }
});

// Get all chats for an agent
export const getAgentChats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  try {
    // Get the agent's email from database using userId
    const agent = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, image: true },
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const chats = await prisma.chat.findMany({
      where: {
        agentEmail: agent.email,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            address: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Add agent info to each chat for consistent response structure
    const chatsWithAgent = chats.map((chat) => ({
      ...chat,
      agent,
    }));

    res.status(200).json(chatsWithAgent);
  } catch (error) {
    console.error("Get agent chats error:", error);
    res.status(500).json({ message: "Error fetching chats", error: error.message });
  }
});

// Get single chat with messages
export const getChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        property: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Fetch agent details by email
    const agent = await prisma.user.findUnique({
      where: { email: chat.agentEmail },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    res.status(200).json({ ...chat, agent });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat", error: error.message });
  }
});

// Close chat
export const closeChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await prisma.chat.update({
      where: { id: chatId },
      data: {
        isActive: false,
      },
    });

    res.status(200).json({ message: "Chat closed successfully", chat });
  } catch (error) {
    res.status(500).json({ message: "Error closing chat", error: error.message });
  }
});
