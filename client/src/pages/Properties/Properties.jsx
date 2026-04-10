import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar";
import "./Properties.css";
import useProperties from "../../hooks/useProperties";
import { PuffLoader } from "react-spinners";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Properties = () => {
  const { data, isError, isLoading } = useProperties();
  const [filter, setFilter] = useState("");
  const [searchParams] = useSearchParams();

  // Initialize filter from URL search parameter
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      setFilter(searchQuery);
    }
  }, [searchParams]);

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader color="#4066ff" />
      </div>
    );
  }

  const filteredData = data.filter(
    (property) =>
      property.title.toLowerCase().includes(filter.toLowerCase()) ||
      property.city.toLowerCase().includes(filter.toLowerCase()) ||
      property.country.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="wrapper">
      <div className="flexColCenter paddings innerWidth properties-container">
        <div className="property-bar">
          <SearchBar filter={filter} setFilter={setFilter} />
        </div>
        <div className="paddings flexCenter properties">
          {filteredData.length > 0 ? (
            filteredData.map((card, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <PropertyCard card={card} />
              </motion.div>
            ))
          ) : (
            <span>No properties match your search.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;
