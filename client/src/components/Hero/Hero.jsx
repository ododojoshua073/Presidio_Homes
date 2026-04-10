import "./Hero.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import SearchBar from "../SearchBar/SearchBar";

const Hero = () => {
  // Snowfall animation variants
  const snowflakeVariants = {
    animate: {
      y: ["0vh", "105vh"],
      x: ["-10px", "10px", "-10px"],
      rotate: [0, 360],
      transition: {
        y: {
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        },
        x: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        },
      },
    },
  };

  // Generate dense snowflakes with varied properties
  const generateSnowflakes = () => {
    const snowflakes = [];

    // Create multiple layers of snow with different characteristics
    for (let i = 0; i < 150; i++) {
      const delay = Math.random() * 12;
      const size = Math.random() * 6 + 1; // 1-7px
      const left = Math.random() * 105; // Extend beyond viewport
      const opacity = Math.random() * 0.8 + 0.1; // 0.1-0.9
      const duration = Math.random() * 8 + 8; // 8-16 seconds
      const blur = Math.random() * 2 + 0.5; // 0.5-2.5px blur
      const swayDistance = Math.random() * 20 + 5; // 5-25px sway

      snowflakes.push(
        <motion.div
          key={i}
          className="snowflake"
          variants={snowflakeVariants}
          style={{
            position: "absolute",
            left: `${left}%`,
            top: "-30px",
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            filter: `blur(${blur}px)`,
            opacity: opacity,
            pointerEvents: "none",
            zIndex: 1,
            boxShadow: "0 0 3px rgba(255, 255, 255, 0.3)",
          }}
          transition={{
            y: {
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            },
            x: {
              duration: Math.random() * 3 + 3, // 3-6 seconds
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            },
            rotate: {
              duration: Math.random() * 4 + 5, // 5-9 seconds
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            },
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [
              `-${swayDistance}px`,
              `${swayDistance}px`,
              `-${swayDistance}px`,
            ],
            rotate: [0, 360],
          }}
        />
      );
    }

    // Add some larger, more prominent snowflakes for depth
    for (let i = 0; i < 30; i++) {
      const delay = Math.random() * 15;
      const size = Math.random() * 8 + 4; // 4-12px (larger)
      const left = Math.random() * 105;
      const opacity = Math.random() * 0.6 + 0.3; // 0.3-0.9
      const duration = Math.random() * 6 + 10; // 10-16 seconds (slower)
      const blur = Math.random() * 1.5 + 2; // 2-3.5px blur (more blur)
      const swayDistance = Math.random() * 30 + 10; // 10-40px sway

      snowflakes.push(
        <motion.div
          key={`large-${i}`}
          className="snowflake-large"
          style={{
            position: "absolute",
            left: `${left}%`,
            top: "-40px",
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: "50%",
            filter: `blur(${blur}px)`,
            opacity: opacity,
            pointerEvents: "none",
            zIndex: 0,
            boxShadow: "0 0 6px rgba(255, 255, 255, 0.4)",
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [
              `-${swayDistance}px`,
              `${swayDistance}px`,
              `-${swayDistance}px`,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            y: {
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            },
            x: {
              duration: Math.random() * 4 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            },
            rotate: {
              duration: Math.random() * 6 + 8,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            },
          }}
        />
      );
    }

    for (let i = 0; i < 100; i++) {
      const delay = Math.random() * 20;
      const size = Math.random() * 2 + 0.5;
      const left = Math.random() * 110;
      const opacity = Math.random() * 0.4 + 0.1;
      const duration = Math.random() * 10 + 15;
      const blur = Math.random() * 3 + 1;

      snowflakes.push(
        <motion.div
          key={`tiny-${i}`}
          className="snowflake-tiny"
          style={{
            position: "absolute",
            left: `${left}%`,
            top: "-20px",
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: "50%",
            filter: `blur(${blur}px)`,
            opacity: opacity,
            pointerEvents: "none",
            zIndex: 0,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: ["-5px", "5px", "-5px"],
          }}
          transition={{
            y: {
              duration: duration,
              repeat: Infinity,
              ease: "linear",
              delay: delay,
            },
            x: {
              duration: Math.random() * 6 + 6, // 6-12 seconds
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            },
          }}
        />
      );
    }

    return snowflakes;
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
  };

  const textVariants = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: 100,
      opacity: 0,
      rotateX: -90,
    },
    visible: {
      y: 0,
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "backOut",
        staggerChildren: 0.1,
      },
    },
  };

  const statItemVariants = {
    hidden: {
      y: 30,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
  };

  const imageVariants = {
    hidden: {
      x: 100,
      opacity: 0,
      scale: 0.8,
      rotate: 10,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1],
        delay: 0.2,
      },
    },
  };

  const circleVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "backOut",
        delay: 0.5,
      },
    },
  };

  return (
    <section
      className="hero-wrapper"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Dense Snowfall Background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "110%", // Extend beyond viewport for edge coverage
          height: "110%",
          pointerEvents: "none",
          zIndex: 1,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)", // Subtle snowy atmosphere
        }}
      >
        {generateSnowflakes()}
      </div>

      {/* Atmospheric overlay for depth */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <motion.div
        className="paddings innerWidth flexCenter hero-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: "relative", zIndex: 2 }}
      >
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">
            <motion.div className="orange-circle" variants={circleVariants} />
            <motion.h1 variants={titleVariants}>
              <motion.span
                variants={wordVariants}
                style={{ display: "inline-block" }}
              >
                Discover
              </motion.span>{" "}
              <br />
              <motion.span
                variants={wordVariants}
                style={{ display: "inline-block" }}
              >
                Most
              </motion.span>{" "}
              <motion.span
                variants={wordVariants}
                style={{ display: "inline-block" }}
              >
                Suitable
              </motion.span>
              <br />
              <motion.span
                variants={wordVariants}
                style={{ display: "inline-block" }}
              >
                Property
              </motion.span>
            </motion.h1>
          </div>

          <motion.div
            className="flexColStart secondaryText flexhero-des"
            variants={textVariants}
          >
            <motion.span variants={textVariants}>
              Find a variety of properties that suit you very easily
            </motion.span>
            <motion.span variants={textVariants}>
              Forget all difficulties in finding a residence for you
            </motion.span>
          </motion.div>

          <motion.div
            variants={textVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <SearchBar />
          </motion.div>

          <motion.div className="flexCenter stats" variants={statsVariants}>
            <motion.div
              className="flexColCenter stat"
              variants={statItemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <span>
                <CountUp start={500} end={2500} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">Properties Sold</span>
            </motion.div>

            <motion.div
              className="flexColCenter stat"
              variants={statItemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <span>
                <CountUp start={500} end={2000} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">Happy Clients</span>
            </motion.div>

            <motion.div
              className="flexColCenter stat"
              variants={statItemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <span>
                <CountUp end={28} /> <span>+</span>
              </span>
              <span className="secondaryText">Awards Winning</span>
            </motion.div>
          </motion.div>
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            className="image-container"
            variants={imageVariants}
            whileHover={{
              scale: 1.02,
              rotate: -2,
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.img
              src="./hero-image.png"
              alt="houses"
              initial={{ filter: "blur(10px)" }}
              animate={{ filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
