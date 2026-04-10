import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaCheck, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="authContainer">
      <motion.div
        className="authForm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="authHeader"
        >
          <h1>Create Account</h1>
          <p>Join us today and find your dream home</p>
        </motion.div>

        {(localError || error) && (
          <motion.div
            className="errorMessage"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>⚠️ {localError || error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <motion.div
            className="formGroup"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
          >
            <label htmlFor="name">Full Name</label>
            <div className="inputWrapper">
              <FaUser className="inputIcon" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          <motion.div
            className="formGroup"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
          >
            <label htmlFor="email">Email Address</label>
            <div className="inputWrapper">
              <FaEnvelope className="inputIcon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          <motion.div
            className="formGroup"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="password">Password</label>
            <div className="inputWrapper">
              <FaLock className="inputIcon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className="togglePassword"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="passwordRequirement">
              {formData.password.length >= 6 ? (
                <>
                  <FaCheck className="checkIcon" /> 6 characters
                </>
              ) : (
                <span>At least 6 characters</span>
              )}
            </div>
          </motion.div>

          <motion.div
            className="formGroup"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.25 }}
          >
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="inputWrapper">
              <FaLock className="inputIcon" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              <button
                type="button"
                className="togglePassword"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="passwordRequirement">
                {formData.password === formData.confirmPassword ? (
                  <>
                    <FaCheck className="checkIcon" /> Passwords match
                  </>
                ) : (
                  <span>Passwords do not match</span>
                )}
              </div>
            )}
          </motion.div>

          <motion.button
            type="submit"
            className="submitBtn"
            disabled={isLoading}
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinnerIcon" /> Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </motion.button>
        </form>

        <motion.div
          className="toggleText"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          Already have an account?{" "}
          <Link to="/login">
            Sign in
            <span className="linkArrow">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
