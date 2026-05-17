import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [msg, setMsg] = useState({
    type: "",
    text: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMsg({
        type: "error",
        text: "Fill all fields",
      });
      return;
    }

    if (password.length < 6) {
      setMsg({
        type: "error",
        text: "Password minimum 6 characters",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:8000/signup",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setMsg({
          type: "success",
          text: "Account Created Successfully",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setMsg({
          type: "error",
          text:
            data.detail ||
            "Signup failed",
        });
      }
    } catch (error) {
      setMsg({
        type: "error",
        text: "Server Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          Create an Account
        </h2>

        <p style={styles.sub}>
          Start your financial journey today
        </p>

        {msg.text && (
          <div
            style={{
              ...styles.alert,
              background:
                msg.type ===
                "success"
                  ? "#DCFCE7"
                  : "#FEE2E2",
              color:
                msg.type ===
                "success"
                  ? "#166534"
                  : "#991B1B",
            }}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
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
            placeholder="Minimum 6 characters"
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
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{" "}
          <Link to="/login">
            Sign in instead
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

  title: {
    marginBottom: "8px",
  },

  sub: {
    color: "#64748B",
    marginBottom: "18px",
  },

  alert: {
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border:
      "1px solid #D1D5DB",
    fontSize: "15px",
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

export default Signup;