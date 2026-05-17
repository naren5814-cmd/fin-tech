import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [msg, setMsg] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg(""); // Clear previous messages

  try {
    setLoading(true);

    const res = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if the response is actually JSON before parsing
    const data = await res.json();
    console.log("STATUS:", res.status);
    console.log("RESPONSE DATA:", data);

    if (res.ok && data.success) {
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("name", data.user.name);

      setMsg("Login Success! Redirecting...");

        if (data.linked) {
          setTimeout(() => {
            navigate("/Home");
          }, 1000);
        } 
        // ✅ NEW USER
        else {
          setTimeout(() => {
            navigate("/account-details");
          }, 1000);
        }
      
    } else {
      // Show the error message from backend or a default one
      setMsg(data.detail || "Invalid Credentials");
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    setMsg("Server Error: Cannot connect to backend");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Welcome Back</h2>

        <p style={styles.sub}>
          Enter your credentials to access your wallet
        </p>

        {msg && (
          <div style={styles.alert}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <button
            style={styles.btn}
            disabled={loading}
          >
            {loading
              ? "Signing..."
              : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{" "}
          <Link to="/signup">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "30px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.08)",
  },

  sub: {
    color: "#64748B",
    marginBottom: "18px",
  },

  alert: {
    background: "#EEF2FF",
    color: "#4F46E5",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border:
      "1px solid #D1D5DB",
    boxSizing:
      "border-box",
  },

  btn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#4F46E5",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  footer: {
    marginTop: "18px",
    textAlign: "center",
    color: "#64748B",
  },
};

export default Login;