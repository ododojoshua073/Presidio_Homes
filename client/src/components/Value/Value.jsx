import React, { useRef, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
  AccordionItemState,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";
import { MdOutlineArrowDropDown } from "react-icons/md";
import data from "../../utils/accordion.jsx";
import "./Value.css";
import { motion, useInView } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Value = () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const isLeftInView = useInView(leftRef, { margin: "-100px", once: false });
  const isRightInView = useInView(rightRef, { margin: "-100px", once: false });

  return (
    <section id="value" className="v-wrapper">
      <div className="paddings innerWidth flexCenter v-container">
        {/* Left Side */}
        <motion.div
          ref={leftRef}
          className="v-left"
          variants={fadeInUp}
          initial="hidden"
          animate={isLeftInView ? "visible" : "hidden"}
          transition={{ duration: 0.6 }}
        >
          <div className="value-image-container">
            <img src="./h10.webp" alt="value" />
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          ref={rightRef}
          className="flexColStart v-right"
          variants={fadeInUp}
          initial="hidden"
          animate={isRightInView ? "visible" : "hidden"}
          transition={{ duration: 0.8 }}
        >
          <span className="orangeText">Our Value</span>
          <span className="primaryText">Value We Give to You</span>
          <span className="secondaryText">
            We’re always ready to help by providing the best services for you.
            <br />
            We believe a good place to live can make your life better.
          </span>

          <Accordion
            className="accordion"
            allowMultipleExpanded={false}
            preExpanded={[0]}
          >
            {data.map((item, i) => (
              <AccordionItem uuid={i} key={i} className="accordionItem">
                <AccordionItemState>
                  {({ expanded }) => (
                    <div
                      className={`accordionItem ${
                        expanded ? "expanded" : "collapsed"
                      }`}
                    >
                      <AccordionItemHeading>
                        <AccordionItemButton className="flexCenter accordionButton">
                          <div className="flexCenter icon">{item.icon}</div>
                          <span className="primaryText">{item.heading}</span>
                          <div className="flexCenter icon">
                            <MdOutlineArrowDropDown size={20} />
                          </div>
                        </AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <p className="secondaryText">{item.detail}</p>
                      </AccordionItemPanel>
                    </div>
                  )}
                </AccordionItemState>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default Value;
