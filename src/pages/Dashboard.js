import React, { useState, useEffect, useContext } from "react";
import { FiHome, FiFileText, FiStar, FiSettings, FiLogOut, FiUpload, FiTrash2, FiMessageSquare } from "react-icons/fi";
import api from "../api";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [msg, setMsg] = useState("");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    const res = await api.get("documents/");
    setDocs(res.data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    if (title) form.append("title", title);
    await api.post("documents/", form);
    setMsg("Uploaded!");
    setTimeout(() => setMsg(""), 3000);
    fetchDocs();
  };

  const deleteDoc = async (id) => {
    await api.delete(`documents/${id}/`);
    fetchDocs();
  };

  const askAI = async (e) => {
    e.preventDefault();
    if (!selectedDoc || !question) return;
    setAnswer("Loading...");
    const res = await api.post("ask-question/", { doc_id: selectedDoc, question });
    setAnswer(res.data.answer);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#f0f2f5" }}>
      
      <div style={{
        width: "240px",
        background: "#1f2937",
        color: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "30px 20px",
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
      }}>
        <h1 style={{ fontWeight: "700", fontSize: "1.8rem", marginBottom: "40px", color: "#3b82f6" }}>
          📁 Dashboard
        </h1>

        <div style={{ flexGrow: 1 }}>
          <SidebarItem icon={<FiHome />} label="Home" />
          <SidebarItem icon={<FiFileText />} label="Files" />
          <SidebarItem icon={<FiStar />} label="Starred" />
          <SidebarItem icon={<FiSettings />} label="Settings" />
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            background: "#ef4444",
            border: "none",
            color: "#fff",
            padding: "12px",
            fontWeight: "600",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "background 0.3s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#dc2626")}
          onMouseLeave={e => (e.currentTarget.style.background = "#ef4444")}
        >
          <FiLogOut size={20} /> Logout
        </button>
      </div>

      <div style={{ flex: 1, padding: "40px 50px", overflowY: "auto" }}>
        <h2 style={{ fontWeight: "700", fontSize: "1.8rem", color: "#374151", marginBottom: "30px" }}>Your Documents</h2>

        <form onSubmit={upload} style={{ display: "flex", gap: "12px", marginBottom: "40px", alignItems: "center" }}>
          <label
            htmlFor="fileInput"
            style={{
              background: "#3b82f6",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "600",
              userSelect: "none",
            }}
          >
            <FiUpload size={20} /> Select File
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.txt"
            style={{ display: "none" }}
            onChange={e => setFile(e.target.files[0])}
          />
          <input
            placeholder="Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1.5px solid #d1d5db",
              fontSize: "1rem",
              outline: "none",
              transition: "border-color 0.3s",
            }}
            onFocus={e => (e.target.style.borderColor = "#3b82f6")}
            onBlur={e => (e.target.style.borderColor = "#d1d5db")}
          />
          <button
            type="submit"
            style={{
              background: "#3b82f6",
              border: "none",
              color: "#fff",
              padding: "12px 22px",
              fontWeight: "700",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#2563eb")}
            onMouseLeave={e => (e.currentTarget.style.background = "#3b82f6")}
          >
            Upload
          </button>
          {msg && <span style={{ color: "#10b981", fontWeight: "600" }}>{msg}</span>}
        </form>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {docs.map(doc => (
            <div
              key={doc.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "24px",
                boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.3s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h4 style={{ marginBottom: "18px", fontWeight: "700", color: "#111827" }}>{doc.title || doc.file}</h4>
              <div>
                <button
                  onClick={() => deleteDoc(doc.id)}
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    marginRight: "14px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#dc2626")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#ef4444")}
                >
                  <FiTrash2 size={18} /> Delete
                </button>
                <button
                  onClick={() => setSelectedDoc(doc.id)}
                  style={{
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: "600",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#059669")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#10b981")}
                >
                  <FiMessageSquare size={18} /> Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedDoc && (
          <form onSubmit={askAI} style={{ marginTop: "50px", maxWidth: "700px" }}>
            <h3 style={{ fontWeight: "700", marginBottom: "18px", color: "#374151" }}>Ask about document #{selectedDoc}</h3>
            <div style={{ display: "flex", gap: "12px" }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Type your question..."
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1.5px solid #d1d5db",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s",
                }}
                onFocus={e => (e.target.style.borderColor = "#3b82f6")}
                onBlur={e => (e.target.style.borderColor = "#d1d5db")}
              />
              <button
                type="submit"
                style={{
                  background: "#3b82f6",
                  border: "none",
                  color: "#fff",
                  padding: "12px 24px",
                  fontWeight: "700",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "#2563eb")}
                onMouseLeave={e => (e.currentTarget.style.background = "#3b82f6")}
              >
                Ask
              </button>
            </div>
            <div style={{ marginTop: "20px", fontWeight: "700", color: "#111827" }}>Answer: {answer}</div>
          </form>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "14px",
      fontWeight: "600",
      fontSize: "1.1rem",
      padding: "12px 10px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "background 0.3s",
      marginBottom: "16px",
      userSelect: "none",
    }}
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ fontSize: "1.4rem", color: "#3b82f6" }}>{icon}</div>
      {label}
    </div>
  );
}
