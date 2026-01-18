import { useState } from "react";
import { FiUser, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
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
          LOGIN
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative mb-4">
          <FiUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-600" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-12 pr-4 py-3 rounded-full outline-none transition bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 font-medium rounded-full transition bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="px-2 text-sm text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm mt-3">
        <span className="text-gray-600">
          Don't have an account?
          <Link
            to="/signup"
            className="font-medium ml-2 cursor-pointer hover:underline text-blue-600"
          >
            Sign Up
          </Link>
        </span>

        <Link to="/forgot-password" className="text-gray-600 hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
