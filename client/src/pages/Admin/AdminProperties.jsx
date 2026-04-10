import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTrash, FaEdit, FaEye, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAdminProperties } from "../../hooks/useAdminProperties";
import "../Admin/Admin.css";

const AdminProperties = () => {
  const { properties, isLoading, deleteProperty, isDeleting, refetch } =
    useAdminProperties();
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleDelete = (propertyId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProperty(propertyId, {
        onSuccess: () => {
          toast.success("Property deleted successfully", {
            position: "bottom-right",
          });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to delete property", {
            position: "bottom-right",
          });
        },
      });
    }
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filter === "All" ||
      (filter === "rent" && p.forStatus === "rent") ||
      (filter === "sale" && p.forStatus === "sale");
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="admin-section">
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading properties...</p>
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
          <h1>Properties Management</h1>
          <p className="subtitle">Total: {properties.length} properties</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filters">
            {["All", "rent", "sale"].map((status) => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? "active" : ""}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {filteredProperties.length === 0 ? (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>No properties found</p>
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
                <th>Title</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Owner</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <motion.tr
                  key={property.id}
                  variants={rowVariants}
                  whileHover="hover"
                >
                  <td className="title">{property.title}</td>
                  <td>
                    {property.city}, {property.country}
                  </td>
                  <td>${property.price.toLocaleString()}</td>
                  <td>
                    <span className="type-badge">
                      {property.forStatus === "rent" ? "Rent" : "Sale"}
                    </span>
                  </td>
                  <td>{property.owner?.name || "N/A"}</td>
                  <td className="actions">
                    <button
                      className="action-btn view"
                      title="View Details"
                      onClick={() => {
                        window.open(`/property/${property.id}`, "_blank");
                      }}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => handleDelete(property.id, property.title)}
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

export default AdminProperties;
