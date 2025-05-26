import React, { useState, useContext } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAccessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("token/", { username, password });
      localStorage.setItem("accessToken", res.data.access);
      localStorage.setItem("refreshToken", res.data.refresh);
      setAccessToken(res.data.access);

      setMsg("Login successful!");
      setMsgType("success");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setMsg("Login failed. Please check your credentials.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-800 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-blue-700 text-center mb-6">Welcome Back</h2>

          <form onSubmit={submit}>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3 rounded-lg font-semibold transition duration-300`}
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              )}
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {msg && (
            <div
              className={`mt-4 text-center text-sm font-medium ${
                msgType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {msg}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Not registered?
            <Link to="/register">
              <button className="ml-2 text-blue-600 hover:underline hover:text-blue-800 transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Welcome Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-600 to-blue-800 text-white flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">New Here?</h2>
          <p className="text-center mb-6">Sign up and start your journey with us.</p>
          <Link to="/register">
            <button className="bg-white text-blue-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
