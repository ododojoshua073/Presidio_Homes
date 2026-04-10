import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaCrown, FaSpinner, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import "../Admin/Admin.css";

const AdminUsers = () => {
  const { users, isLoading, deleteUser, makeAdmin, isDeleting, isPromoting, refetch } =
    useAdminUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Refetch on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    hover: {
      backgroundColor: "rgba(255, 107, 53, 0.05)",
      transition: { duration: 0.2 },
    },
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"?`)) {
      deleteUser(userId, {
        onSuccess: () => {
          toast.success("User deleted successfully", {
            position: "bottom-right",
          });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete user", {
            position: "bottom-right",
          });
        },
      });
    }
  };

  const handleMakeAdmin = (userId, userName) => {
    if (window.confirm(`Make "${userName}" an admin?`)) {
      makeAdmin(userId, {
        onSuccess: () => {
          toast.success("User promoted to admin", {
            position: "bottom-right",
          });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to promote user", {
            position: "bottom-right",
          });
        },
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase?.().includes(searchTerm.toLowerCase()) || false) ||
      (user.email?.toLowerCase?.().includes(searchTerm.toLowerCase()) || false);
    const matchesRole =
      roleFilter === "All" ||
      (roleFilter === "Admin" && user.isAdmin) ||
      (roleFilter === "User" && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return (
      <div className="admin-section">
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <h1>Users Management</h1>
          <p className="subtitle">Total: {users.length} users</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            icon={<FaSearch />}
          />
          <div className="filters">
            {["All", "Admin", "User"].map((role) => (
              <button
                key={role}
                className={`filter-btn ${roleFilter === role ? "active" : ""}`}
                onClick={() => setRoleFilter(role)}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {filteredUsers.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No users found</p>
        </motion.div>
      ) : (
        <motion.div
          className="table-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  variants={rowVariants}
                  whileHover="hover"
                >
                  <td className="name-cell">
                    <div className="user-info">
                      {user.image && (
                        <img src={user.image} alt={user.name} className="user-avatar" />
                      )}
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.isAdmin ? "admin" : "user"}`}>
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    {!user.isAdmin && (
                      <button
                        className="action-btn promote"
                        title="Make Admin"
                        onClick={() => handleMakeAdmin(user.id, user.name)}
                        disabled={isPromoting}
                      >
                        {isPromoting ? <FaSpinner className="spinner" /> : <FaCrown />}
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      title="Delete User"
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? <FaSpinner className="spinner" /> : <FaTrash />}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsers;
