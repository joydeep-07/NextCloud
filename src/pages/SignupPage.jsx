import { useState } from "react";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../services/auth.service";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
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
      // Prepare data for API (exclude confirmPassword)
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
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
        {/* Name and Surname in one row */}
        <div className="flex gap-4 mb-4">
          {/* Name */}
          <div className="relative flex-1">
            <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Surname */}
          <div className="relative flex-1">
            <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
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
            className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
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
            className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
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
            className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-medium rounded-full transition bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm mt-3">
        <span className="text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="font-medium ml-2 cursor-pointer hover:underline text-blue-600"
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
};

export default SignupPage;
