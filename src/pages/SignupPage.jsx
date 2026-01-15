import { useState } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { signUp } from "../services/auth.service";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;

      await signUp(signupData);

      setSuccess(
        "Account registered successfully. Please check your email inbox and verify your email to login."
      );
    } catch (err) {
      console.error(err);

      if (err?.message?.toLowerCase().includes("already")) {
        setError("Email already registered");
      } else {
        setError(err.message || "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent flex flex-col w-full max-w-4xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-semibold mt-2 mb-5 text-gray-800">
          SIGN UP
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* First & Last Name */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative flex-1">
            <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <FiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <FiLock className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="text-center text-sm mt-3">
        <span className="text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-2 font-medium text-blue-600 hover:underline"
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
