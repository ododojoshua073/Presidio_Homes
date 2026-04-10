import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import AdminUsers from "./AdminUsers";
import AdminProperties from "./AdminProperties";
import AdminDash from "./AdminDash";
import "./Admin.css";
import { motion } from "framer-motion";
import { FaUsers, FaHome, FaChartBar, FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const adminMenuItems = [
    { icon: <FaChartBar />, label: "Dashboard", path: "/admin" },
    { icon: <FaUsers />, label: "Users", path: "/admin/users" },
    { icon: <FaHome />, label: "Properties", path: "/admin/properties" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <motion.aside
        className={`admin-sidebar ${sidebarOpen ? "open" : "closed"}`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="admin-logo">
          <h2>Presidio Admin</h2>
        </div>

        <nav className="admin-nav">
          {adminMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-footer">
          <button onClick={handleBackHome} className="back-home-btn" title="Back to Home">
            <FaArrowLeft />
            <span>Back Home</span>
          </button>
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.div className="admin-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Routes>
          <Route index element={<AdminDash />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/properties" element={<AdminProperties />} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
