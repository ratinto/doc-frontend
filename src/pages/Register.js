import React, { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await api.post("register/", { username, password });
      setMsg("Registration successful! You can now login.");
      setMsgType("success");
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      setMsg("Registration failed. Try a different username.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-700 px-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side - Register Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-indigo-700 text-center mb-6">Create Account</h2>

          <form onSubmit={submit}>
            <input
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 ${
                loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
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
              {loading ? "Registering..." : "Register"}
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
            Already have an account?
            <Link to="/login">
              <button className="ml-2 text-indigo-600 hover:underline hover:text-indigo-800 transition">
                Login
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Welcome Panel */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-indigo-600 to-purple-700 text-white flex-col items-center justify-center p-10">
          <h2 className="text-3xl font-bold mb-4">Welcome!</h2>
          <p className="text-center mb-6">Already registered? Login to continue your journey.</p>
          <Link to="/login">
            <button className="bg-white text-indigo-700 font-semibold px-6 py-2 rounded-lg shadow hover:bg-gray-100 transition">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
