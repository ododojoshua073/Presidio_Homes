import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaHome, FaFacebookMessenger, FaBell } from "react-icons/fa";
import { getDashboardStats } from "../../utils/api";

const AdminDash = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalChats: 0,
    rentProperties: 0,
    saleProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }
      const data = await getDashboardStats(token);
      setStats({
        totalUsers: data.totalUsers || 0,
        totalProperties: data.totalProperties || 0,
        totalChats: data.totalChats || 0,
        rentProperties: data.rentProperties || 0,
        saleProperties: data.saleProperties || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: <FaUsers />,
      label: "Total Users",
      value: stats.totalUsers,
      color: "#ff6b35",
    },
    {
      icon: <FaHome />,
      label: "Total Properties",
      value: stats.totalProperties,
      color: "#f7931e",
    },
    {
      icon: <FaFacebookMessenger />,
      label: "Active Chats",
      value: stats.totalChats,
      color: "#4066ff",
    },
    {
      icon: <FaBell />,
      label: "Properties for Rent",
      value: stats.rentProperties,
      color: "#2ecc71",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="admin-dash">
      <motion.h1 variants={cardVariants} initial="hidden" animate="visible">
        Dashboard Overview
      </motion.h1>

      <motion.div
        className="stats-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            className="stat-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="stat-icon" style={{ color: card.color }}>
              {card.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{card.label}</p>
              <h3 className="stat-value">{loading ? "..." : card.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="admin-info"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2>Platform Overview</h2>
        <p>Welcome to the Presidio Real Estate Admin Dashboard.</p>
        <ul>
          <li>Manage users and their accounts</li>
          <li>Monitor property listings</li>
          <li>Track user interactions and chats</li>
          <li>View system notifications</li>
          <li>Generate reports and analytics</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default AdminDash;
