import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { getProperty } from "../../utils/api.js";
import { PuffLoader } from "react-spinners";
import { FaShower, FaEnvelope, FaMapMarkerAlt, FaComments, FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import { MdLocationPin, MdMeetingRoom, MdStraighten } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";
import Map from "../../components/Map/Map";
import useAuthCheck from "../../hooks/useAuthCheck";
import { useAuth } from "../../context/AuthContext.jsx";
import UserDetailContext from "../../context/UserDetailContext";
import { toast } from "react-toastify";
import Heart from "../../components/Heart/Heart";
import StartChatButton from "../../components/StartChatButton/StartChatButton";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "./Property.css";
// Enhanced Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const slideInRight = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "backOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Property = () => {
  const { propertyId } = useParams();

  const { data, isLoading, isError } = useQuery(
    ["property", propertyId],
    () => getProperty(propertyId),
    {
      enabled: !!propertyId,
    }
  );

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { validateLogin } = useAuthCheck();

  const {
    userDetails: { token, bookings },
    setUserDetails,
  } = useContext(UserDetailContext);

  if (isLoading) {
    return (
      <div className="loading-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="loading-content"
        >
          <PuffLoader color="#ff6600" size={60} />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="loading-text"
          >
            Loading property details...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="error-container"
      >
        <div className="error-content">
          <span className="error-text">
            Error while fetching the property details
          </span>
        </div>
      </motion.div>
    );
  }

  const {
    image,
    images,
    price,
    title,
    description,
    address,
    city,
    country,
    userEmail,
    facilities,
    forStatus,
    agentDetails,
  } = data;

  // Extract agent contact details from agentDetails JSON or individual fields
  const agentInstagram = data?.agentInstagram || agentDetails?.instagram;
  const agentWhatsapp = data?.agentWhatsapp || agentDetails?.whatsapp;
  const agentFacebook = data?.agentFacebook || agentDetails?.facebook;
  const agentEmail = data?.agentEmail || userEmail || agentDetails?.email;

  return (
    <motion.div
      className="property-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="property-container">
        {/* Enhanced Heart with Floating Animation */}
        <motion.div
          className="property-heart-container"
          variants={scaleIn}
          whileHover={{
            scale: 1.1,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <Heart id={propertyId} />
          <motion.div
            className="property-heart-glow"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Enhanced Image Gallery */}
        <motion.div className="gallery-container" variants={fadeInUp}>
          <AnimatePresence mode="wait">
            {images?.length > 1 ? (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
              >
                <Swiper
                  modules={[Navigation, Pagination, Thumbs, EffectFade]}
                  spaceBetween={10}
                  navigation
                  pagination={{
                    type: "fraction",
                    formatFractionCurrent: (number) => `0${number}`.slice(-2),
                    formatFractionTotal: (number) => `0${number}`.slice(-2),
                  }}
                  thumbs={{ swiper: thumbsSwiper }}
                  effect="fade"
                  fadeEffect={{ crossFade: true }}
                  className="main-gallery"
                  onSlideChange={() => {
                    // Trigger a subtle animation on slide change
                  }}
                >
                  {data.images.map((imgUrl, i) => (
                    <SwiperSlide key={i}>
                      <motion.div
                        className="property-image-container"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.4 }}
                      >
                        <img
                          src={imgUrl}
                          alt={`Property view ${i + 1}`}
                          onLoad={() => setImageLoaded(true)}
                        />
                        <div className="property-image-overlay" />
                      </motion.div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <motion.div
                  className="thumbnail-container"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Swiper
                    modules={[Thumbs]}
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView="auto"
                    watchSlidesProgress
                    className="thumbnail-swiper"
                  >
                    {data.images.map((imgUrl, i) => (
                      <SwiperSlide key={i}>
                        <motion.div
                          className="thumbnail-slide"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <img src={imgUrl} alt={`Thumbnail ${i + 1}`} />
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="single"
                className="single-image-container"
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <img src={data.image} alt="Property" className="single-image" />
                <div className="image-overlay" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Property Details */}
        <motion.div className="property-details" variants={staggerContainer}>
          <motion.div className="property-info" variants={slideInLeft}>
            {/* Header Section */}
            <motion.div className="property-header" variants={staggerItem}>
              <motion.div
                className="title-section"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h1 className="property-title">{data.title}</h1>
                <motion.div
                  className="title-decoration"
                  initial={{ width: 0 }}
                  animate={{ width: "60px" }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </motion.div>

              <motion.div
                className="price-section"
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
              >
                <span className="price-label">Price</span>
                <span className="price-value">
                  {data.price !== undefined
                    ? `$${price.toLocaleString()}`
                    : "Loading..."}
                </span>
                <motion.div
                  className="price-sparkle"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <HiSparkles />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Status Badge */}
            <motion.div
              className="status-container"
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className={`status-badge ${
                  data.forStatus?.toLowerCase() === "rent" ? "rent" : "sale"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                FOR {data.forStatus?.toUpperCase()}
              </motion.span>
            </motion.div>

            {/* Facilities */}
            <motion.div
              className="facilities-container"
              variants={staggerContainer}
            >
              <h3 className="section-title">Features</h3>
              <div className="facilities-grid">
                {[
                  {
                    icon: FaShower,
                    value: data.facilities?.bathrooms,
                    label: "Bathrooms",
                    color: "#3b82f6",
                  },
                  {
                    icon: MdMeetingRoom,
                    value: data.facilities?.bedrooms,
                    label: "Bedrooms",
                    color: "#10b981",
                  },
                  {
                    icon: MdStraighten,
                    value: data.facilities?.squareFeet,
                    label: "sq ft",
                    color: "#f59e0b",
                  },
                ].map((facility, index) => (
                  <motion.div
                    key={index}
                    className="facility-card"
                    variants={staggerItem}
                    whileHover={{
                      y: -5,
                      scale: 1.05,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="facility-icon"
                      style={{ backgroundColor: `${facility.color}15` }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <facility.icon size={24} color={facility.color} />
                    </motion.div>
                    <div className="facility-info">
                      <span className="facility-value">{facility.value}</span>
                      <span className="facility-label">{facility.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              className="description-container"
              variants={staggerItem}
            >
              <h3 className="section-title">Description</h3>
              <motion.p
                className="description-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {data.description}
              </motion.p>
            </motion.div>

            {/* Location */}
            <motion.div
              className="location-container"
              variants={staggerItem}
              whileHover={{ x: 5 }}
            >
              <div className="location-info">
                <FaMapMarkerAlt size={20} color="#ef4444" />
                <span className="location-text">
                  {data.address}, {data.city}, {data.country}
                </span>
              </div>
            </motion.div>

            {/* Contact Buttons Container */}
            <motion.div className="contact-buttons-wrapper" variants={staggerItem}>
              {/* Contact Button */}
              <motion.div className="contact-container">
                <motion.a
                  href={`mailto:${userEmail}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.button
                    className="contact-button"
                    whileHover={{
                      boxShadow: "0 10px 30px rgba(255, 102, 0, 0.3)",
                      y: -2,
                    }}
                  >
                    <FaEnvelope />
                    <span>Contact Agent</span>
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
              </motion.div>

              {/* Chat Button */}
              <motion.div className="contact-container">
                <StartChatButton 
                  propertyId={propertyId} 
                  agentEmail={userEmail}
                  propertyTitle={data?.title}
                />
              </motion.div>
            </motion.div>

            {/* Social Media Links */}
            {(agentInstagram || agentWhatsapp || agentFacebook) && (
              <motion.div className="social-links-container" variants={staggerItem}>
                <p className="social-links-title">Other ways to connect:</p>
                <div className="social-links">
                  {agentInstagram && (
                    <motion.a
                      href={`https://instagram.com/${agentInstagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link instagram"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Instagram: ${agentInstagram}`}
                    >
                      <FaInstagram />
                    </motion.a>
                  )}
                  {agentWhatsapp && (
                    <motion.a
                      href={`https://wa.me/${agentWhatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link whatsapp"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      title={`WhatsApp: ${agentWhatsapp}`}
                    >
                      <FaWhatsapp />
                    </motion.a>
                  )}
                  {agentFacebook && (
                    <motion.a
                      href={`https://facebook.com/${agentFacebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link facebook"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Facebook: ${agentFacebook}`}
                    >
                      <FaFacebook />
                    </motion.a>
                  )}
                  {agentEmail && (
                    <motion.a
                      href={`mailto:${agentEmail}`}
                      className="social-link email"
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      title={`Email: ${agentEmail}`}
                    >
                      <FaEnvelope />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Map Section */}
          <motion.div className="map-container" variants={slideInRight}>
            <motion.div
              className="map-wrapper"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Map
                address={data.address}
                city={data.city}
                country={data.country}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Property;
