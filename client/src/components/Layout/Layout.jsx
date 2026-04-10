import React, { useContext, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDetailContext from "../../context/UserDetailContext";
import useFavourites from "../../hooks/useFavourites";
import useBookings from "../../hooks/useBookings";

const Layout = () => {
  useFavourites();
  useBookings();

  const { isAuthenticated, user, token } = useAuth();
  const { setUserDetails } = useContext(UserDetailContext);

  useEffect(() => {
    // Update token in context when user is authenticated
    if (isAuthenticated && token) {
      setUserDetails((prev) => ({ ...prev, token }));
    }
  }, [isAuthenticated, token, setUserDetails]);

  return (
    <>
      <div style={{ background: "var(--black)", overflow: "hidden" }}>
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
