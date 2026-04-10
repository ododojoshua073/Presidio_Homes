import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { prisma } from "../config/prismaConfig.js";
import { generateToken, verifyToken } from "../config/jwtConfig.js";

// User Registration
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res.status(400).json({ message: "User already registered" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

// User Login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password || "");
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isAdmin: true,
        bookedVisits: true,
        favResidenciesID: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Update User
export const updateUser = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isAdmin: true,
      },
    });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Create User (for backward compatibility)
export const createUser = asyncHandler(async (req, res) => {
  let { email, name } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const user = await prisma.user.create({
      data: { name: name || email.split("@")[0], email: email },
    });
    res.send({
      message: "User registered successfully",
      user: user,
    });
  } else res.status(201).send({ message: "User already registered" });
});

// Book a visit to residency
export const bookVisit = asyncHandler(async (req, res) => {
  const { date } = req.body;
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { id: userId },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("your visit is booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Get all bookings of a user
export const getAllBookings = asyncHandler(async (req, res) => {
  // Bookings feature is suspended
  res.status(200).json({ bookedVisits: [] });
});

// Cancel a booking
export const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { id: userId },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });

      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Add residency to favorites
export const toFav = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { id: userId },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Get all favorites
export const getAllFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  
  try {
    const favResd = await prisma.user.findUnique({
      where: { id: userId },
      select: { favResidenciesID: true },
    });
    
    if (!favResd) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(favResd);
  } catch (err) {
    console.error("Get favorites error:", err);
    res.status(500).json({ message: "Error fetching favorites", error: err.message });
  }
});

// Get all users (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Verify requester is admin
    const requester = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isAdmin: true },
    });

    if (!requester?.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isAdmin: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// Delete user (Admin)
export const deleteUser = asyncHandler(async (req, res) => {
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

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all messages sent by this user (cascade from chats deletion)
    const chatsToDelete = await prisma.chat.findMany({
      where: {
        OR: [
          { userId: id },
          { agentEmail: user.email },
        ],
      },
      select: { id: true },
    });

    const chatIds = chatsToDelete.map((chat) => chat.id);

    if (chatIds.length > 0) {
      await prisma.message.deleteMany({
        where: {
          chatId: { in: chatIds },
        },
      });
    }

    // Delete associated chats
    await prisma.chat.deleteMany({
      where: {
        OR: [
          { userId: id },
          { agentEmail: user.email },
        ],
      },
    });

    // Delete associated notifications
    await prisma.notification.deleteMany({
      where: {
        OR: [
          { senderId: id },
          { receiverId: id },
        ],
      },
    });

    // Delete associated residencies (use userEmail field)
    await prisma.residency.deleteMany({
      where: { userEmail: user.email },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion failed:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

// Make user admin (Admin)
export const makeUserAdmin = asyncHandler(async (req, res) => {
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

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isAdmin: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    res.status(200).json({ message: "User promoted to admin", user: updatedUser });
  } catch (error) {
    console.error("Make admin failed:", error);
    res.status(500).json({ message: "Failed to promote user", error: error.message });
  }
});

// Get dashboard stats (Admin)
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Verify requester is admin
    const requester = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isAdmin: true },
    });

    if (!requester?.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    // Get stats
    const totalUsers = await prisma.user.count();
    const totalAdmins = await prisma.user.count({
      where: { isAdmin: true },
    });
    const totalProperties = await prisma.residency.count();
    const totalChats = await prisma.chat.count();

    // Get properties by status
    const rentProperties = await prisma.residency.count({
      where: { forStatus: "rent" },
    });
    const saleProperties = await prisma.residency.count({
      where: { forStatus: "sale" },
    });

    res.status(200).json({
      totalUsers,
      totalAdmins,
      totalProperties,
      totalChats,
      rentProperties,
      saleProperties,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
});

