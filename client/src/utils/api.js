import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

export const getAllProperties = async () => {
  try {
    const response = await api.get("/residency/allresd", {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`, {
      timeout: 10 * 1000,
    });

    if (response.status === 400 || response.status === 500) {
      throw response.data;
    }
    return response.data;
  } catch (error) {
    toast.error("Something went wrong");
    throw error;
  }
};

export const createUser = async (email, token) => {
  try {
    await api.post(
      `/user/register`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const bookVisit = async (date, propertyId, token) => {
  try {
    await api.post(
      `/user/bookVisit/${propertyId}`,
      {
        id: propertyId,
        date: dayjs(date).format("DD/MM/YYYY"),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");
    throw error;
  }
};

export const removeBooking = async (id, token) => {
  try {
    await api.post(
      `/user/removeBooking/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    toast.error("Something went wrong, Please try again");

    throw error;
  }
};

export const toFav = async (id, token) => {
  try {
    await api.post(
      `/user/toFav/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (e) {
    throw e;
  }
};

export const getAllFav = async (token) => {
  if (!token) return;
  try {
    const res = await api.post(
      `/user/allFav`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data["favResidenciesID"];
  } catch (e) {
    toast.error("Something went wrong while fetching favs");
    throw e;
  }
};

export const getAllBookings = async (token) => {
  if (!token) return;
  try {
    const res = await api.post(
      `/user/allBookings`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data["bookedVisits"];
  } catch (error) {
    toast.error("Something went wrong while fetching bookings");
    throw error;
  }
};

export const createResidency = async (data, token) => {
  try {
    const res = await api.post(
      `/residency/create`,
      {
        ...data,
        forStatus: data.forStatus,
        images: data.images || [],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    toast.error("Failed to create residency");
    throw error;
  }
};

// Chat API calls
export const createChat = async (propertyId, agentEmail, token) => {
  try {
    const response = await api.post(
      `/chat/create`,
      { propertyId, agentEmail },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to create chat");
    throw error;
  }
};

export const getUserChats = async (token) => {
  try {
    const response = await api.get(`/chat/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch chats");
    throw error;
  }
};

// Notification API calls
export const getNotifications = async (token) => {
  try {
    const response = await api.get(`/notification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch notifications");
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId, token) => {
  try {
    const response = await api.put(
      `/notification/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to mark notification as read");
    throw error;
  }
};

// Dashboard stats API call
export const getDashboardStats = async (token) => {
  try {
    const response = await api.get(`/user/admin/dashboard-stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};

// Admin User Management API calls
export const getAllUsers = async (token) => {
  try {
    const response = await api.get(`/user/admin/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await api.delete(`/user/admin/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

export const makeUserAdmin = async (userId, token) => {
  try {
    const response = await api.put(
      `/user/admin/make-admin/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to promote user:", error);
    throw error;
  }
};

// Property Management API calls
export const deleteProperty = async (propertyId, token) => {
  try {
    const response = await api.delete(`/residency/admin/delete/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Property deleted successfully");
    return response.data;
  } catch (error) {
    toast.error("Failed to delete property");
    console.error("Failed to delete property:", error);
    throw error;
  }
};
