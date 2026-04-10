import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./GetStarted.css";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const GetStarted = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { margin: "-100px", once: false });

  return (
    <div id="get-started" className="g-wrapper">
      <motion.div
        ref={sectionRef}
        className="paddings innerWidth g-container"
        variants={fadeInUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="flexColCenter inner-container">
          <span className="primaryText">Get started with Presidio</span>
          <span className="secondaryText">
            Subscribe and find super attractive price quotes from us.
            <br />
            Find your residence soon
          </span>
          <Link to="/properties">
            <button className="button">Get Started</button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default GetStarted;
