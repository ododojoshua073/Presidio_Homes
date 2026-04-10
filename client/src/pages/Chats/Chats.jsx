import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaArrowLeft, FaCircle, FaCheck, FaCheckDouble } from "react-icons/fa";
import "./Chats.css";

const Chats = () => {
  const { chats, currentChat, messages, isLoading: contextLoading, getUserChats, getAgentChats, getSingleChat, sendMessage } = useChat();
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatsFetched, setChatsFetched] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      if (chatsFetched || !user) return;
      
      setLoading(true);
      try {
        // If user is admin, fetch agent chats, otherwise fetch user chats
        if (user?.isAdmin) {
          await getAgentChats();
        } else {
          await getUserChats();
        }
        setChatsFetched(true);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setChatsFetched(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, [user?.isAdmin, user?.id]);

  const handleSelectChat = async (chatId) => {
    setSelectedChatId(chatId);
    try {
      await getSingleChat(chatId);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChatId || !currentChat) return;

    const receiverId = currentChat.userId === user.id ? currentChat.agent.id : currentChat.user.id;

    try {
      await sendMessage(selectedChatId, receiverId, messageInput);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Format timestamp
  const formatMessageTime = (date) => {
    const msgDate = new Date(date);
    const now = new Date();
    const isToday = msgDate.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = msgDate.toDateString() === yesterday.toDateString();

    if (isToday) {
      return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="chats-wrapper">
      <div className="chats-container">
        {/* Chat List */}
        <motion.div className="chats-list" variants={containerVariants} initial="hidden" animate="visible">
          <div className="chats-header">
            <h2>Messages</h2>
            {chats.some((c) => c.messages?.some((m) => !m.isRead)) && (
              <motion.span
                className="unread-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {chats.filter((c) => c.messages?.some((m) => !m.isRead)).length}
              </motion.span>
            )}
          </div>

          {loading ? (
            <div className="loading">
              <motion.div className="loader" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} />
              <p>Loading chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <motion.div className="empty-state" variants={itemVariants}>
              <div className="empty-icon">💬</div>
              <p>No chats yet</p>
              <small>{user?.isAdmin ? "Waiting for customer inquiries..." : "Start a conversation with an agent!"}</small>
            </motion.div>
          ) : (
            <div className="chats-list-content">
              {chats.map((chat) => {
                const isSelected = chat.id === selectedChatId;
                const lastMessage = chat.messages?.[0];
                const contactName = chat.agent?.name || chat.user?.name || "Unknown";
                const hasUnread = chat.messages?.some((m) => !m.isRead);

                return (
                  <motion.div
                    key={chat.id}
                    className={`chat-item ${isSelected ? "active" : ""} ${hasUnread ? "unread" : ""}`}
                    onClick={() => handleSelectChat(chat.id)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    variants={itemVariants}
                  >
                    <div className="chat-avatar">
                      {(chat.agent?.image || chat.user?.image) ? (
                        <img src={chat.agent?.image || chat.user?.image} alt="avatar" />
                      ) : (
                        <div className="avatar-placeholder">{contactName.charAt(0).toUpperCase()}</div>
                      )}
                      {chat.isActive && <div className="status-indicator"></div>}
                    </div>
                    <div className="chat-info">
                      <div className="chat-header-line">
                        <h4>{contactName}</h4>
                        {lastMessage && <span className="timestamp">{formatMessageTime(lastMessage.createdAt)}</span>}
                      </div>
                      <p className="chat-property">{chat.property?.title || "Property"}</p>
                      {lastMessage && (
                        <p className={`chat-preview ${hasUnread ? "unread" : ""}`}>
                          {lastMessage.senderId === user.id ? "You: " : ""}
                          {lastMessage.content.substring(0, 50)}
                          {lastMessage.content.length > 50 ? "..." : ""}
                        </p>
                      )}
                    </div>
                    {hasUnread && <div className="unread-dot"></div>}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Chat View */}
        <AnimatePresence mode="wait">
          {selectedChatId && currentChat ? (
            <motion.div
              key={selectedChatId}
              className="chat-view"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
            >
              {/* Chat Header */}
              <div className="chat-header">
                <button
                  className="back-button"
                  onClick={() => {
                    setSelectedChatId(null);
                    setMessageInput("");
                  }}
                >
                  <FaArrowLeft />
                </button>
                <div className="chat-header-info">
                  <h3>{currentChat.agent?.name || currentChat.user?.name}</h3>
                  <p>{currentChat.property?.title}</p>
                </div>
                {currentChat.isActive && <div className="status-badge">Active</div>}
              </div>

              {/* Messages */}
              <motion.div className="messages-container" variants={containerVariants} initial="hidden" animate="visible">
                {contextLoading && messages.length === 0 ? (
                  <motion.div
                    className="pondering-state"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <motion.div
                      className="pondering-circle"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <div className="pondering-dot"></div>
                    </motion.div>
                    <p>Pondering...</p>
                  </motion.div>
                ) : (
                  <>
                    <AnimatePresence>
                      {messages.map((msg, idx) => {
                        const isOwn = msg.senderId === user.id;
                        // Determine sender info (could be user or agent based on who sent it)
                        const senderInfo = msg.senderId === currentChat.userId ? currentChat.user : currentChat.agent;
                        return (
                          <motion.div
                            key={msg.id || idx}
                            className={`message ${isOwn ? "own" : "other"}`}
                            variants={messageVariants}
                          >
                        {!isOwn && (
                          <div className="message-avatar">
                            {senderInfo?.image ? (
                              <img src={senderInfo.image} alt="sender" />
                            ) : (
                              <div className="avatar-small">
                                {(senderInfo?.name || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="message-wrapper">
                          <motion.div
                            className="message-content"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <p>{msg.content}</p>
                            <div className="message-footer">
                              <span className="message-time">{formatMessageTime(msg.createdAt)}</span>
                              {isOwn && (
                                <span className="message-status">
                                  {msg.isRead ? <FaCheckDouble /> : <FaCheck />}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {isTyping && (
                      <motion.div
                        className="typing-indicator"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <span></span>
                        <span></span>
                        <span></span>
                      </motion.div>
                    )}
                  </>
                )}
                <div ref={messagesEndRef} />
              </motion.div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-input-form">
                <input
                  type="text"
                  placeholder="Type a message... (optional contact message)"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="message-input"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  className="send-button"
                  disabled={!messageInput.trim()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPaperPlane />
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              className="no-chat-selected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="empty-state">
                <div className="empty-icon" style={{ fontSize: "4rem" }}>📱</div>
                <h2>Select a chat to start messaging</h2>
                <p>Choose a conversation from the list to begin</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chats;
