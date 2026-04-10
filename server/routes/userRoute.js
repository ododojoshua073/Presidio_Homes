import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUser,
  bookVisit,
  cancelBooking,
  createUser,
  getAllBookings,
  toFav,
  getAllFavorites,
  getAllUsers,
  deleteUser,
  makeUserAdmin,
  getDashboardStats,
} from "../controllers/userCntrl.js";
import jwtCheck from "../config/jwtConfig.js";
const router = express.Router();

// Auth routes (no JWT required)
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (JWT required)
router.get("/me", jwtCheck, getCurrentUser);
router.put("/update", jwtCheck, updateUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", jwtCheck, getAllBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFavorites);

// Admin routes (JWT required)
router.get("/admin/all-users", jwtCheck, getAllUsers);
router.delete("/admin/delete/:id", jwtCheck, deleteUser);
router.put("/admin/make-admin/:id", jwtCheck, makeUserAdmin);
router.get("/admin/dashboard-stats", jwtCheck, getDashboardStats);

// Legacy create user route
router.post("/create-user", createUser);

export { router as userRoute };

