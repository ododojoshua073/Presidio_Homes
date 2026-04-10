import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext.jsx";

const ChatContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const ChatProvider = ({ children }) => {
  const { token } = useAuth();
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosConfig = useMemo(
    () => ({
      headers: { Authorization: `Bearer ${token}` },
    }),
    [token]
  );

  const getUserChats = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/chat/user", axiosConfig);
      setChats(response.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch chats";
      setError(errorMsg);
      console.error("Get user chats error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, axiosConfig]);

  const getAgentChats = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/chat/agent", axiosConfig);
      setChats(response.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to fetch chats";
      setError(errorMsg);
      console.error("Get agent chats error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, axiosConfig]);

  const createChat = useCallback(async (propertyId, agentEmail) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/chat/create",
        { propertyId, agentEmail },
        axiosConfig
      );
      setCurrentChat(response.data);
      // Fetch updated chats list
      const chatsResponse = await axiosInstance.get("/chat/user", axiosConfig);
      setChats(chatsResponse.data);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create chat";
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  const getSingleChat = useCallback(async (chatId) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/chat/${chatId}`, axiosConfig);
      setCurrentChat(response.data);
      setMessages(response.data.messages || []);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to fetch chat";
      setError(errorMsg);
      console.error("Get single chat error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [axiosConfig]);

  const sendMessage = useCallback(async (chatId, receiverId, content) => {
    try {
      const response = await axiosInstance.post(
        "/message/send",
        { chatId, receiverId, content },
        axiosConfig
      );
      setMessages((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send message";
      setError(errorMsg);
      throw err;
    }
  }, [axiosConfig]);

  const markMessageAsRead = useCallback(async (messageId) => {
    try {
      await axiosInstance.put(`/message/${messageId}/read`, {}, axiosConfig);
    } catch (err) {
      console.error("Failed to mark message as read:", err);
    }
  }, [axiosConfig]);

  const closeChat = useCallback(async (chatId) => {
    try {
      await axiosInstance.put(`/chat/${chatId}/close`, {}, axiosConfig);
      // Refetch chats to get updated list
      const chatsResponse = await axiosInstance.get("/chat/user", axiosConfig);
      setChats(chatsResponse.data);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to close chat";
      setError(errorMsg);
    }
  }, [axiosConfig]);

  useEffect(() => {
    if (token) {
      getUserChats();
    }
  }, [token]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        createChat,
        getUserChats,
        getAgentChats,
        getSingleChat,
        sendMessage,
        markMessageAsRead,
        closeChat,
        isLoading,
        error,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
