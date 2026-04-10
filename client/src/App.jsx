import { Suspense, useState } from "react";
import "./App.css";
import Layout from "./components/Layout/Layout";
import Website from "./pages/Website";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Properties from "./pages/Properties/Properties";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Property from "./pages/Property/Property";
import UserDetailContext from "./context/UserDetailContext";
import { useAuth } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import Favourites from "./pages/Favourites/Favourites";
import AboutUs from "./pages/AboutUs/AboutUs";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Chats from "./pages/Chats/Chats";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function App() {
  const queryClient = new QueryClient();
  const { isAuthenticated, user } = useAuth();

  const [userDetails, setUserDetails] = useState({
    favourites: [],
    token: null,
  });

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const AdminRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (!user?.isAdmin) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
      <QueryClientProvider client={queryClient}>
        <ChatProvider>
          <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Website />} />
                  <Route path="/properties">
                    <Route index element={<Properties />} />
                    <Route path="/properties/:propertyId" element={<Property />} />
                  </Route>
                  <Route
                    path="/favourites"
                    element={
                      <ProtectedRoute>
                        <Favourites />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/chats"
                    element={
                      <ProtectedRoute>
                        <Chats />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/aboutUs" element={<AboutUs />} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </ChatProvider>
      </QueryClientProvider>
    </UserDetailContext.Provider>
  );
}

export default App;
