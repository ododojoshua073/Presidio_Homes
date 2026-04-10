import React, { useState } from "react";
import { FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { MdArrowForward } from "react-icons/md";
import { truncate } from "lodash";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Heart from "../Heart/Heart";
import "./PropertyCard.css";

const PropertyCard = ({ card }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.03,
      y: -8,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const overlayVariants = {
    initial: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <Link to={`/properties/${card.id}`} className="property-card-link">
      <motion.div
        className="property-card"
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="heart-container">
          <Heart id={card?.id} />
        </div>

        <div className="card-image-container">
          <motion.img
            src={card.image}
            alt={card.title}
            variants={imageVariants}
            onLoad={() => setImageLoaded(true)}
            className={`property-image ${imageLoaded ? "loaded" : ""}`}
          />

          <motion.div className="card-image-overlay" variants={overlayVariants}>
            <motion.div
              className="card-overlay-content"
              whileHover={{ scale: 1, opacity: 1 }}
            >
              <FaEye size={24} />
              <span>View Details</span>
            </motion.div>
          </motion.div>

          {/* {card.price > 500000 && (
          <motion.div className="premium-badge" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            ✨ Premium
          </motion.div>
        )} */}

          {!imageLoaded && (
            <div className="card-image-skeleton">
              <motion.div
                className="skeleton-shimmer"
                animate={{ x: [-200, 200] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

        <motion.div className="card-content">
          <div className="price-container">
            <span className="currency">$</span>
            <span className="price">{card.price?.toLocaleString()}</span>
            <motion.div
              className="price-trend"
              animate={{ rotate: isHovered ? [0, 5, -5, 0] : 0 }}
            >
              📈
            </motion.div>
          </div>

          <motion.h3
            className="property-card-title"
            whileHover={{ color: "#ff6600" }}
          >
            {truncate(card.title, { length: 18 })}
          </motion.h3>
          <p className="property-card-description">
            {truncate(card.description, { length: 85 })}
          </p>

          {card.city && (
            <motion.div
              className="location-info"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
            >
              <FaMapMarkerAlt size={12} />
              <span>{card.city}</span>
            </motion.div>
          )}

          <motion.div
            className="card-action"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <motion.button
              className="view-button"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Property</span>
              <MdArrowForward />
            </motion.button>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="floating-elements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="floating-dot"
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1, 0],
                    x: Math.random() * 100 - 50,
                    y: Math.random() * 100 - 50,
                  }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};

export default PropertyCard;
