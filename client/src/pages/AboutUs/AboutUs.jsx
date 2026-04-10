import React, { useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import "./AboutUs.css";
import { Link } from "react-router-dom";

// Custom Icon Components
const BuildingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7V10H22V7L12 2Z" />
    <path d="M2 10V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V10H2ZM8 18H6V16H8V18ZM8 14H6V12H8V14ZM12 18H10V16H12V18ZM12 14H10V12H12V14ZM16 18H14V16H16V18ZM16 14H14V12H16V14ZM20 18H18V16H20V18ZM20 14H18V12H20V14Z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4C18.2 4 20 5.8 20 8S18.2 12 16 12 12 10.2 12 8 13.8 4 16 4M16 14C20.4 14 24 15.8 24 18V20H8V18C8 15.8 11.6 14 16 14M8 4C10.2 4 12 5.8 12 8S10.2 12 8 12 4 10.2 4 8 5.8 4 8 4M8 14C12.4 14 16 15.8 16 18V20H0V18C0 15.8 3.6 14 8 14Z" />
  </svg>
);

const AwardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 21L5.5 20L6.5 21L8.5 16H5ZM12 12.5C14.21 12.5 16 10.71 16 8.5S14.21 4.5 12 4.5 8 6.29 8 8.5 9.79 12.5 12 12.5ZM12 6C13.38 6 14.5 7.12 14.5 8.5S13.38 11 12 11 9.5 9.88 9.5 8.5 10.62 6 12 6ZM19 16L21 21L18.5 20L17.5 21L15.5 16H19Z" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" />
  </svg>
);

const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 21C8.13 19.91 5 16.54 5 11V6.3L12 3.19L19 6.3V11C19 16.54 15.87 19.91 12 21Z" />
  </svg>
);

const StarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9S10.62 6.5 12 6.5 14.5 7.62 14.5 9 13.38 11.5 12 11.5Z" />
  </svg>
);

const AboutUs = () => {
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Stats data
  const stats = [
    {
      icon: BuildingIcon,
      number: "2500+",
      label: "Properties Sold",
      color: "#f59e0b",
    },
    {
      icon: UsersIcon,
      number: "2K+",
      label: "Happy Clients",
      color: "#10b981",
    },
    {
      icon: AwardIcon,
      number: "10+",
      label: "Years Experience",
      color: "#3b82f6",
    },
    {
      icon: TrendingIcon,
      number: "98%",
      label: "Success Rate",
      color: "#ef4444",
    },
  ];

  // Values data
  const values = [
    {
      icon: HeartIcon,
      title: "Client-Centric",
      description:
        "Your dreams and needs are at the heart of everything we do.",
    },
    {
      icon: ShieldIcon,
      title: "Trustworthy",
      description:
        "Built on integrity, transparency, and honest communication.",
    },
    {
      icon: StarIcon,
      title: "Excellence",
      description: "Committed to delivering exceptional service and results.",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const logoVariants = {
    initial: {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
    },
    animate: {
      rotateY: [0, 15, -15, 0],
      rotateX: [0, 10, -10, 0],
      scale: [1, 1.05, 1],
      filter: [
        "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
        "drop-shadow(0 20px 40px rgba(245,158,11,0.4))",
        "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
      ],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="about-wrapper">
      {/* Hero Section */}
      <motion.section
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-content">
          <motion.div
            className="logo-container"
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <div className="logo-3d">
              <img
                src="./presidio.jpg"
                alt="Presidio Real Estate"
                className="logo-image"
              />
            </div>
          </motion.div>

          <motion.div className="hero-text" variants={itemVariants}>
            <h1 className="hero-title">About Presidio Real Estate</h1>
            <p className="hero-subtitle">
              Building dreams, creating homes, and transforming communities for
              over 10 years
            </p>
          </motion.div>
        </div>

        <motion.div className="floating-elements" style={{ y: y1 }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
            />
          ))}
        </motion.div>
      </motion.section>

      {/* Story Section */}
      <motion.section
        className="story-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="story-content">
          <motion.div className="story-text" variants={itemVariants}>
            <h2 className="section-title">Our Story</h2>
            <div className="story-description">
              <p>
                Founded in 2015, Presidio Real Estate began as a small boutique
                agency with a simple mission: to revolutionize the way people
                buy, sell, and experience real estate.
              </p>
              <p>
                What started as a one-person operation has grown into a thriving
                company of dedicated professionals, each committed to providing
                exceptional service and delivering results that exceed
                expectations.
              </p>
              <p>
                Today, we're proud to be one of the most trusted names in real
                estate, helping thousands of families find their perfect homes
                while building lasting relationships in our community.
              </p>
            </div>
          </motion.div>

          <motion.div className="story-visual" variants={itemVariants}>
            <div className="story-image-container">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                alt="Modern office building"
                className="story-image"
              />
              <div className="story-overlay">
                <div className="overlay-content">
                  <span className="overlay-text">Est. 2015</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="stats-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          Our Achievements
        </motion.h2>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  "--icon-color": stat.color,
                }}
              >
                <stat.icon />
              </div>
              <motion.div
                className="stat-number"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                {stat.number}
              </motion.div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        className="values-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.h2 className="section-title" variants={itemVariants}>
          Our Values
        </motion.h2>
        <div className="values-grid">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="value-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                rotateY: 5,
                rotateX: 5,
              }}
              style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
            >
              <div className="value-icon">
                <value.icon />
              </div>
              <h3 className="value-title">{value.title}</h3>
              <p className="value-description">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="cta-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div className="cta-content" variants={itemVariants}>
          <h2 className="cta-title">Ready to Find Your Dream Home?</h2>
          <p className="cta-subtitle">
            Let our experienced team guide you through your real estate journey
          </p>
          <Link to="/properties">
            <motion.button
              className="cta-button"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 15px 30px rgba(245, 158, 11, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
              <motion.span
                className="button-arrow"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default AboutUs;
