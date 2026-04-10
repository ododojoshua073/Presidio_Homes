import React, { useState, useEffect } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { getMenuStyles } from "../../utils/common";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModal from "../AddPropertyModal/AddPropertyModal";
import useAuthCheck from "../../hooks/useAuthCheck.jsx";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [modalOpened, setModalOpened] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { validateLogin } = useAuthCheck();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  };

  // Animation variants
  const headerVariants = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    tap: { scale: 0.95 },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      color: "#ff6b35",
      transition: { duration: 0.2 },
    },
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "backOut",
        staggerChildren: 0.1,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 8px 25px rgba(255, 107, 53, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.section
      className={`h-wrapper ${isScrolled ? "scrolled" : ""}`}
      style={{
        background: isScrolled ? "rgba(255, 255, 255, 0.95)" : "#161616ff",
        backdropFilter: isScrolled ? "blur(20px)" : "blur(50px)",
        borderBottom: isScrolled
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "none",
      }}
      variants={headerVariants}
      initial="initial"
      animate="animate"
    >
      <div className="flexCenter innerWidth paddings h-container">
        {/* Enhanced Logo */}
        <Link to="/">
          <motion.div
            className="headerText"
            variants={logoVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <motion.h2
              className="header-text1"
              style={{ color: isScrolled ? "#1f3e72" : "#ffffff" }}
            >
              Presidio
            </motion.h2>
            <motion.div
              className="header-blub"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />

            {/* Glow effect behind logo */}
            <motion.div
              className="logo-glow"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </Link>

        {/* Enhanced Desktop Menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <motion.div
            className="flexCenter h-menu desktop-menu"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={menuItemVariants} whileHover="hover">
              <NavLink
                to="/properties"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                style={{ color: isScrolled ? "#1f3e72" : "inherit" }}
              >
                Properties
              </NavLink>
            </motion.div>

            <motion.div variants={menuItemVariants} whileHover="hover">
              <a
                href="mailto:presidiorealestate9@gmail.com"
                style={{ color: isScrolled ? "#1f3e72" : "inherit" }}
              >
                Contact
              </a>
            </motion.div>

            <motion.div variants={menuItemVariants} whileHover="hover">
              <NavLink
                to="/aboutUs"
                className={({ isActive }) => (isActive ? "active-link" : "")}
                style={{ color: isScrolled ? "#1f3e72" : "inherit" }}
              >
                About Us
              </NavLink>
            </motion.div>

            <motion.div
              variants={menuItemVariants}
              whileHover="hover"
              onClick={handleAddPropertyClick}
              className="add-property-btn"
              style={{ color: isScrolled ? "#1f3e72" : "inherit" }}
            >
              Add Property
            </motion.div>

            <AddPropertyModal opened={modalOpened} setOpened={setModalOpened} />

            {/* Link to Chats */}
            {isAuthenticated && (
              <motion.div variants={menuItemVariants} whileHover="hover">
                <NavLink
                  to="/chats"
                  className={({ isActive }) => (isActive ? "active-link" : "")}
                  style={{ color: isScrolled ? "#1f3e72" : "inherit" }}
                >
                  Messages
                </NavLink>
              </motion.div>
            )}

            {/* Enhanced Login/Profile */}
            {!isAuthenticated ? (
              <motion.button
                className="button enhanced-button"
                onClick={() => navigate("/login")}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <span>Login</span>
                <motion.div
                  className="button-bg"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileMenu user={user} logout={logout} />
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Mobile Menu */}
          <AnimatePresence>
            {menuOpened && (
              <motion.div
                className="h-menu mobile-menu"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.div variants={mobileItemVariants}>
                  <NavLink
                    to="/properties"
                    onClick={() => setMenuOpened(false)}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                  >
                    Properties
                  </NavLink>
                </motion.div>

                <motion.div variants={mobileItemVariants}>
                  <a
                    href="mailto:presidiorealestate9@gmail.com"
                    onClick={() => setMenuOpened(false)}
                  >
                    Contact
                  </a>
                </motion.div>

                <motion.div variants={menuItemVariants} whileHover="hover">
                  <NavLink
                    to="/aboutUs"
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                  >
                    About Us
                  </NavLink>
                </motion.div>

                <motion.div
                  variants={mobileItemVariants}
                  onClick={() => {
                    handleAddPropertyClick();
                    setMenuOpened(false);
                  }}
                  className="add-property-btn"
                >
                  Add Property
                </motion.div>

                {isAuthenticated && (
                  <motion.div variants={mobileItemVariants}>
                    <NavLink
                      to="/chats"
                      onClick={() => setMenuOpened(false)}
                      className={({ isActive }) => (isActive ? "active-link" : "")}
                    >
                      Messages
                    </NavLink>
                  </motion.div>
                )}

                {!isAuthenticated ? (
                  <motion.button
                    className="button enhanced-button mobile"
                    onClick={() => {
                      navigate("/login");
                      setMenuOpened(false);
                    }}
                    variants={mobileItemVariants}
                  >
                    <span>Login</span>
                  </motion.button>
                ) : (
                  <motion.div variants={mobileItemVariants}>
                    <ProfileMenu user={user} logout={logout} />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </OutsideClickHandler>

        {/* Enhanced Mobile Menu Icon */}
        <motion.div
          className="menu-icon"
          animate={{ rotate: menuOpened ? 90 : 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpened((prev) => !prev)}
          style={{ color: isScrolled ? "#1f3e72" : "inherit" }}
        >
          <AnimatePresence mode="wait">
            {menuOpened ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiX size={30} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BiMenuAltRight size={30} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Header;
