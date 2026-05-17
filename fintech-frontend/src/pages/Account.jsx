import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Account() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(true);
  const { showToast } = useToast();
    const handleSend = () => {
      showToast(
        "success",
        "Money sent successfully"
      )
    }

  const [accountData, setAccountData] =
    useState(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] =
    useState("");
  const [account, setAccount] =
    useState("");
  const [ifsc, setIfsc] = useState("");

  const handleMobile = (e) => {
    const value =
      e.target.value.replace(/\D/g, "");
    setMobile(value.slice(0, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !mobile ||
      !account ||
      !ifsc
    ) {
      showToast("error","Fill all fields");
      return;
    }

    if (mobile.length !== 10) {
      showToast(
        "error","Mobile number must be 10 digits"
      );
      return;
    }

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/account-details",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            name,
            mobile_number: mobile,
            account_number: account,
            ifsc_code: ifsc,
          }),
        }
      );

      
      if (!res.ok) {
        const text = await res.text();
        console.log(text);
        showToast("error", "API Error");
        return;
      }
      const data = await res.json();

      if (data.success) {
        showToast(
          "success","Account Created Successfully"
        );


        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        showToast(
          data.detail || "Failed"
        );
      }
    } catch (error) {
      console.log(error);
      showToast("error","Server Error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const maskMobile = (num) => {
    if (!num) return "";
    return (
      "XXXXXXX" + num.slice(-3)
    );
  };

  if (loading) {
    return (
      <h2 style={{ padding: "30px" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div style={styles.page}>
      {/* Top Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>
          My Account
        </h1>

        <div style={styles.topBtns}>
          <button
            style={styles.plusBtn}
            onClick={() =>
              setShowForm(true)
            }
          >
            +
          </button>

          <button
            style={styles.logoutBtn}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Success */}
      {success && (
        <div style={styles.success}>
          {success}
        </div>
      )}

      {/* FORM */}
        <div style={styles.card}>
          <h2>
            Create / Link Account
          </h2>

          <form
            onSubmit={handleSubmit}
          >
            <input
              style={styles.input}
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
              placeholder="Mobile Number"
              value={mobile}
              onChange={
                handleMobile
              }
            />

            <input
              style={styles.input}
              placeholder="Account Number"
              value={account}
              onChange={(e) =>
                setAccount(
                  e.target.value
                )
              }
            />

            <input
              style={styles.input}
              placeholder="IFSC Code"
              value={ifsc}
              onChange={(e) =>
                setIfsc(
                  e.target.value.toUpperCase()
                )
              }
            />

            <button
              type="submit"
              style={styles.saveBtn}
            >
              Save Account
            </button>
          </form>
        </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "850px",
    margin: "auto",
    padding: "30px",
    fontFamily: "Arial",
    background: "#F8FAFC",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    margin: 0,
  },

  topBtns: {
    display: "flex",
    gap: "10px",
  },

  plusBtn: {
    width: "42px",
    height: "42px",
    border: "none",
    borderRadius: "50%",
    background: "#4F46E5",
    color: "white",
    fontSize: "24px",
    cursor: "pointer",
  },

  logoutBtn: {
    border: "none",
    padding:
      "10px 16px",
    borderRadius: "10px",
    background: "#EF4444",
    color: "white",
    cursor: "pointer",
  },

  success: {
    background: "#DCFCE7",
    color: "#166534",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontWeight: "600",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border:
      "1px solid #D1D5DB",
    fontSize: "15px",
  },

  saveBtn: {
    width: "100%",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    background: "#4F46E5",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "16px 0",
    borderBottom:
      "1px solid #E5E7EB",
  },
};

export default Account;