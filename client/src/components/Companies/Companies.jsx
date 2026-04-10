import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./Companies.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Companies = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "-100px", once: false });

  return (
    <section className="con-wrapper">
      <motion.div
        ref={containerRef}
        className="paddings innerWidth flexCenter con-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.img
          variants={imageVariants}
          src="./prologis.png"
          alt="Prologis"
        />
        <motion.img variants={imageVariants} src="./tower.png" alt="Tower" />
        <motion.img
          variants={imageVariants}
          src="./equinix.png"
          alt="Equinix"
        />
        <motion.img variants={imageVariants} src="./realty.png" alt="Realty" />
      </motion.div>
    </section>
  );
};

export default Companies;
