import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowUp,
} from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: { opacity: 0, y: 30, transition: { duration: 0.4 } },
  };

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: { scale: 0.95 },
  };

  const socialVariants = {
    hover: {
      scale: 1.2,
      rotate: 15,
      backgroundColor: "#ff6b35",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.9 },
  };

  const menuItemVariants = {
    hover: {
      x: 10,
      color: "#ff6b35",
      transition: { duration: 0.2 },
    },
  };

  const scrollToTopVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#ff6b35",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.9 },
  };

  return (
    <AnimatePresence>
      <motion.footer
        className="f-wrapper"
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: false, amount: 0.3 }}
        variants={containerVariants}
      >
        {/* Decorative Wave */}
        <div className="wave-container">
          <svg
            className="wave"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="rgba(255, 107, 53, 0.1)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="paddings innerWidth f-container">
          <motion.div className="flexColStart f-left" variants={itemVariants}>
            <Link to="/">
              <motion.div
                className="headerText footer-logo"
                variants={logoVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.h2 className="text1">Presidio</motion.h2>
                <motion.div
                  className="blub"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
                <motion.div
                  className="logo-glow"
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </Link>

            <motion.p className="vision-text" variants={itemVariants}>
              Our vision is to make all people find
              <br />
              the best place to live for them.
            </motion.p>

            <motion.div className="social-links" variants={itemVariants}>
              <motion.span className="social-title">Follow Us</motion.span>
              <div className="social-icons">
                {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                  (Icon, i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className="social-icon"
                      variants={socialVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Icon />
                    </motion.a>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Center Section */}
          <motion.div className="flexColStart f-center" variants={itemVariants}>
            <motion.h3 className="section-title" variants={itemVariants}>
              Quick Links
            </motion.h3>
            <motion.div className="f-menu" variants={itemVariants}>
              {["/properties", "/aboutUs"].map((path, i) => (
                <motion.span
                  key={i}
                  variants={menuItemVariants}
                  whileHover="hover"
                >
                  <Link to={path}>{path.replace("/", "")}</Link>
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Section */}
          <motion.div className="flexColStart f-right" variants={itemVariants}>
            <motion.h3 className="section-title" variants={itemVariants}>
              Contact Info
            </motion.h3>

            <motion.div className="contact-info" variants={itemVariants}>
              {[
                [FaMapMarkerAlt, "145 New York, FL 5467, USA"],
                [FaEnvelope, "presidiorealestate9@gmail.com"],
              ].map(([Icon, text], i) => (
                <motion.div
                  key={i}
                  className="contact-item"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <Icon className="contact-icon" />
                  <span>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="f-bottom" variants={itemVariants}>
          <div className="paddings innerWidth flexCenter f-bottom-container">
            <motion.div className="f-bottom-left">
              <span>&copy; 2025 Presidio. All rights reserved.</span>
              <div className="legal-links">
                {["Privacy Policy", "Terms of Service"].map((txt, i) => (
                  <motion.a key={i} href="#" whileHover={{ color: "#ff6b35" }}>
                    {txt}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.button
              className="scroll-to-top"
              onClick={scrollToTop}
              variants={scrollToTopVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaArrowUp />
            </motion.button>
          </div>
        </motion.div>

        {/* Particles */}
        <div className="particles-container">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [-20, -60, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </motion.footer>
    </AnimatePresence>
  );
};

export default Footer;
