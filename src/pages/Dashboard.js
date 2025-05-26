import React, { useState, useEffect, useContext } from "react";
import {
  FiHome,
  FiFileText,
  FiStar,
  FiSettings,
  FiLogOut,
  FiUpload,
  FiTrash2,
  FiCheckCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";
import api, { setAuthToken } from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="mb-6 flex items-center gap-3 cursor-pointer hover:text-blue-400 transition select-none"
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function formatAnswer(answer) {
  const codeRegex = /```([\s\S]*?)```/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  while ((match = codeRegex.exec(answer)) !== null) {
    const before = answer.substring(lastIndex, match.index);
    if (before.trim()) parts.push({ type: "text", content: before });
    parts.push({ type: "code", content: match[1] });
    lastIndex = codeRegex.lastIndex;
  }
  const after = answer.substring(lastIndex);
  if (after.trim()) parts.push({ type: "text", content: after });
  return parts;
}

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [msg, setMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    try {
      const res = await api.get("documents/");
      setDocs(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setMsg("Session expired. Please log in again.");
      } else if (err.response && err.response.status === 403) {
        setMsg("Access denied. You don't have permission.");
      } else {
        setMsg("Error fetching documents.");
      }
    }
  };

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    if (storedAccessToken) {
      setAuthToken(storedAccessToken);
    }
    fetchDocs();
  }, [accessToken]);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setMsg("");
    const form = new FormData();
    form.append("file", file);
    if (title) form.append("title", title);
    try {
      await api.post("documents/", form);
      setMsg("Uploaded!");
      setFile(null);
      setTitle("");
      await fetchDocs();
    } catch (err) {
      setMsg("Upload failed: " + (err.response?.data?.detail || err.message));
    }
    setTimeout(() => setMsg(""), 3000);
  };

  const deleteDoc = async (id) => {
    await api.delete(`documents/${id}/`);
    fetchDocs();
    if (selectedDoc === id) {
      setSelectedDoc(null);
      setShowChat(false);
    }
  };

  const askAI = async (e) => {
    e.preventDefault();
    if (!selectedDoc || !question) return;
    setAnswer("Loading...");
    try {
      const res = await api.post("ask-question/", {
        doc_id: selectedDoc,
        question,
      });
      setAnswer(res.data.answer);
    } catch {
      setAnswer("Failed to get answer. Try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const onAskAIClick = (docId) => {
    setSelectedDoc(docId);
    setShowChat(true);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen font-sans bg-gray-100 overflow-hidden">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-gray-200 p-2 rounded-md focus:outline-none"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      <div
        className={`
          fixed top-0 left-0 h-full bg-gray-800 text-gray-200 p-6 shadow-md
          w-60 flex flex-col
          transform transition-transform duration-300 ease-in-out
          z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:relative md:z-auto
        `}
      >
        <h1 className="text-3xl font-bold text-blue-400 mb-10 select-none">
          DocMan
        </h1>
        <div className="flex-1">
          <SidebarItem icon={<FiHome />} label="Home" onClick={() => setSidebarOpen(false)} />
          <SidebarItem icon={<FiFileText />} label="Files" onClick={() => setSidebarOpen(false)} />
          <SidebarItem icon={<FiStar />} label="Starred" onClick={() => setSidebarOpen(false)} />
          <SidebarItem icon={<FiSettings />} label="Settings" onClick={() => setSidebarOpen(false)} />
        </div>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center gap-2 select-none"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`flex-1 md:p-6 p-4 overflow-y-auto border-r border-gray-300 transition-all duration-300
          ${showChat ? "md:w-[60%]" : "w-full"}
          md:ml-5
        `}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Documents</h2>

        <form
          onSubmit={upload}
          className="flex gap-4 items-center mb-10 flex-wrap"
        >
          <label
            htmlFor="fileInput"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 font-semibold hover:bg-blue-600 select-none"
          >
            <FiUpload /> Select File
            {file && <FiCheckCircle className="ml-2 text-green-300" size={20} />}
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px]"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Upload
          </button>
          {msg && <span className="text-green-600 font-medium">{msg}</span>}
        </form>

        <div className="flex flex-row gap-6 flex-wrap">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition cursor-default w-full sm:w-[48%] md:w-[30%]"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4">
                {doc.title || doc.file}
              </h4>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => deleteDoc(doc.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg flex items-center gap-1 text-sm"
                >
                  <FiTrash2 /> Delete
                </button>
                <button
                  onClick={() => onAskAIClick(doc.id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm"
                >
                  Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showChat && (
        <div className="hidden md:flex md:w-1/5 bg-white p-6 border-l border-gray-300 flex-col">
          <h3 className="text-lg font-semibold mb-4">
            Ask a Question about the selected document
          </h3>
          <form onSubmit={askAI} className="flex flex-col gap-3 flex-grow">
            <textarea
              placeholder="Your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 outline-none resize-none h-28"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Ask
            </button>
          </form>
          <div className="mt-4">
            {answer &&
              formatAnswer(answer).map((part, i) =>
                part.type === "code" ? (
                  <pre key={i} className="bg-gray-200 p-3 rounded-md overflow-x-auto text-sm my-2">
                    {part.content}
                  </pre>
                ) : (
                  <p key={i} className="text-gray-800 text-sm my-2">{part.content}</p>
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
}
