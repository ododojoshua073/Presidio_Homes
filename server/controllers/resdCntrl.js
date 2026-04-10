import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";

export const createResidency = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    address,
    city,
    country,
    image,
    images,
    facilities,
    userEmail,
    forStatus,
    agentInstagram,
    agentWhatsapp,
    agentFacebook,
    agentEmail,
  } = req.body;
  
  if (
    !title ||
    !description ||
    !price ||
    !address ||
    !city ||
    !country ||
    (!image && (!images || images.length === 0)) ||
    !userEmail ||
    !forStatus
  ) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Build agent details object
    const agentDetails = {
      instagram: agentInstagram || null,
      whatsapp: agentWhatsapp || null,
      facebook: agentFacebook || null,
      email: agentEmail || null,
    };
    
    const residency = await prisma.residency.create({
      data: {
        title,
        description,
        price: parseInt(price),
        address,
        city,
        country,
        image: images && images.length > 0 ? images[0] : image,
        images: images || [],
        facilities: facilities || {},
        forStatus,
        agentDetails,
        owner: {
          connect: { email: userEmail },
        },
      },
    });

    res.status(201).json(residency);
  } catch (error) {
    console.error("Residency creation failed:", error);
    res.status(500).json({ message: "Something went wrong while creating the residency", error: error.message });
  }
});

// Get all residencies
export const getAllResidencies = asyncHandler(async (req, res) => {
  const residencies = await prisma.residency.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  res.send(residencies);
});

// Get one residency by ID
export const getResidency = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const residency = await prisma.residency.findUnique({
      where: { id },
    });

    if (!residency) {
      return res.status(404).json({ error: "Residency not found" });
    }

    res.status(200).json(residency);
  } catch (error) {
    console.error("Error fetching residency:", error.message);
    res.status(500).json({ error: "Failed to fetch residency" });
  }
});

// Update residency (Admin)
export const updateResidency = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Verify requester is admin
    const requester = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isAdmin: true },
    });

    if (!requester?.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const {
      title,
      description,
      price,
      address,
      city,
      country,
      image,
      images,
      facilities,
      forStatus,
      agentInstagram,
      agentWhatsapp,
      agentFacebook,
      agentEmail,
    } = req.body;

    // Verify residency exists
    const existingResidency = await prisma.residency.findUnique({
      where: { id },
    });

    if (!existingResidency) {
      return res.status(404).json({ message: "Residency not found" });
    }

    // Build agent details object if contact info provided
    let agentDetails = existingResidency.agentDetails;
    if (agentInstagram || agentWhatsapp || agentFacebook || agentEmail) {
      agentDetails = {
        instagram: agentInstagram || agentDetails?.instagram || null,
        whatsapp: agentWhatsapp || agentDetails?.whatsapp || null,
        facebook: agentFacebook || agentDetails?.facebook || null,
        email: agentEmail || agentDetails?.email || null,
      };
    }

    const updatedResidency = await prisma.residency.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseInt(price) }),
        ...(address && { address }),
        ...(city && { city }),
        ...(country && { country }),
        ...(image && { image }),
        ...(images && { images }),
        ...(facilities && { facilities }),
        ...(forStatus && { forStatus }),
        ...(agentDetails && { agentDetails }),
      },
    });

    res.status(200).json(updatedResidency);
  } catch (error) {
    console.error("Residency update failed:", error);
    res.status(500).json({ message: "Failed to update residency", error: error.message });
  }
});

// Delete residency (Admin)
export const deleteResidency = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Verify requester is admin
    const requester = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isAdmin: true },
    });

    if (!requester?.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    // Verify residency exists
    const residency = await prisma.residency.findUnique({
      where: { id },
    });

    if (!residency) {
      return res.status(404).json({ message: "Residency not found" });
    }

    // Delete associated chats first
    await prisma.chat.deleteMany({
      where: { propertyId: id },
    });

    // Delete the residency
    await prisma.residency.delete({
      where: { id },
    });

    res.status(200).json({ message: "Residency deleted successfully" });
  } catch (error) {
    console.error("Residency deletion failed:", error);
    res.status(500).json({ message: "Failed to delete residency", error: error.message });
  }
});
