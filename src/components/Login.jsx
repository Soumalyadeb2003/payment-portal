import { useState } from "react";

const BACKEND = "https://payment-backend-production-a82f.up.railway.app";

export default function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const url = isSignup
      ? `${BACKEND}/api/auth/signup`
      : `${BACKEND}/api/auth/login`;

    const body = isSignup
      ? { name, email, phone, password }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLogin(data.user, data.token);
      } else {
        setError(data.message || "Something went wrong!");
      }
    } catch (err) {
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f3f3",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <p style={{ fontSize: "24px", fontWeight: "500", color: "#131921", margin: 0 }}>
          Soumalya's
        </p>
        <p style={{ fontSize: "14px", color: "#febd69", fontWeight: "500", margin: 0 }}>
          Payment Portal
        </p>
      </div>

      {/* Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          padding: "32px 28px",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "500",
            color: "#131921",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          {isSignup ? "Create Account" : "Sign In"}
        </h2>

        {/* Name field - only for signup */}
        {isSignup && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Email field */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Phone field - only for signup */}
        {isSignup && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Password field */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", color: "#555", display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fff0f0",
              border: "1px solid #f5c6c6",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
              fontSize: "13px",
              color: "#c0392b",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#febd69",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "500",
            color: "#131921",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "16px",
          }}
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Create Account"
            : "Sign In"}
        </button>

        {/* Toggle between login and signup */}
        <p style={{ textAlign: "center", fontSize: "13px", color: "#555", margin: 0 }}>
          {isSignup ? "Already have an account?" : "New to Soumalya's Portal?"}
          <span
            onClick={() => { setIsSignup(!isSignup); setError(""); }}
            style={{
              color: "#131921",
              fontWeight: "500",
              cursor: "pointer",
              marginLeft: "6px",
              textDecoration: "underline",
            }}
          >
            {isSignup ? "Sign In" : "Create Account"}
          </span>
        </p>
      </div>
    </div>
  );
}