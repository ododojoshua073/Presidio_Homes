import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all fields");
      return;
    }

    try {
      await login(formData.email, formData.password);
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
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
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
                <FaSpinner className="spinnerIcon" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <motion.div
          className="toggleText"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Don't have an account?{" "}
          <Link to="/register">
            Create one
            <span className="linkArrow">→</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
