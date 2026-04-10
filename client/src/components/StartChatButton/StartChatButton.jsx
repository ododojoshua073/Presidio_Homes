import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaComments } from "react-icons/fa";
import { toast } from "react-toastify";
import "./StartChatButton.css";

const StartChatButton = ({ propertyId, propertyTitle, agentEmail }) => {
  const { isAuthenticated, user } = useAuth();
  const { createChat } = useChat();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to start chatting");
      navigate("/login");
      return;
    }

    if (!agentEmail) {
      toast.error("Agent information not available");
      return;
    }

    setLoading(true);
    try {
      const chat = await createChat(propertyId, agentEmail);
      toast.success("Chat started! Redirecting...");
      navigate("/chats");
    } catch (error) {
      toast.error(error.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.a
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ cursor: "pointer" }}
    >
      <motion.button
        onClick={handleStartChat}
        disabled={loading}
        className="contact-button chat-button"
        whileHover={{
          boxShadow: "0 10px 30px rgba(31, 62, 114, 0.3)",
          y: -2,
        }}
      >
        <FaComments />
        <span>{loading ? "Starting..." : "Chat with Agent"}</span>
        <motion.div
          className="button-ripple"
          initial={{ scale: 0, opacity: 0.5 }}
          whileHover={{
            scale: 1,
            opacity: 0,
            transition: { duration: 0.6 },
          }}
        />
      </motion.button>
    </motion.a>
  );
};

export default StartChatButton;
