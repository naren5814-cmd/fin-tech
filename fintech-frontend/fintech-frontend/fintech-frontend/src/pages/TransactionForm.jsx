import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TransactionForm() {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!mobile || !amount) {
      alert("Fill all fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    const sendAmount = Number(amount);

    if (isNaN(sendAmount) || sendAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (sendAmount < 10) {
      alert("Minimum transfer is ₹10");
      return;
    }

    if (sendAmount > 50000) {
      alert("Maximum transfer is ₹50,000");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:8000/send-money",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sender_id: userId,
            receiver_mobile:
              mobile,
            amount: sendAmount,
            description:
              note,
          }),
        }
      );

      const data =
        await res.json();

      if (data.success) {
        alert(
          "Money Sent Successfully"
        );
        navigate("/history");
      } else {
        alert(
          data.detail ||
            "Failed"
        );
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.small}>
            Secure Transfer
          </p>

          <h1 style={styles.title}>
            Send Money
          </h1>
        </div>

        <div style={styles.badge}>
          Instant
        </div>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.topBox}>
          <p style={styles.topLabel}>
            Available Action
          </p>

          <h3
            style={{
              margin:
                "8px 0 0 0",
            }}
          >
            Fast &
            Secure Payment
          </h3>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <label
            style={
              styles.label
            }
          >
            Receiver Mobile
            Number
          </label>

          <input
            style={
              styles.input
            }
            placeholder="Enter 10 digit mobile"
            value={
              mobile
            }
            onChange={(
              e
            ) =>
              setMobile(
                e.target
                  .value
              )
            }
          />

          <label
            style={
              styles.label
            }
          >
            Amount
          </label>

          <input
            style={
              styles.input
            }
            type="number"
            placeholder="Enter amount"
            value={
              amount
            }
            onChange={(
              e
            ) =>
              setAmount(
                e.target
                  .value
              )
            }
          />

          <label
            style={
              styles.label
            }
          >
            Note
            (Optional)
          </label>

          <input
            style={
              styles.input
            }
            placeholder="Payment note"
            value={note}
            onChange={(
              e
            ) =>
              setNote(
                e.target
                  .value
              )
            }
          />

          <button
            style={{
              ...styles.button,
              opacity:
                loading
                  ? 0.8
                  : 1,
            }}
            disabled={
              loading
            }
          >
            {loading
              ? "Sending..."
              : "Send Money"}
          </button>
        </form>
      </div>

      {/* Info */}
      <div
        style={
          styles.info
        }
      >
        <p
          style={{
            margin: 0,
          }}
        >
          Transfers are
          secured with
          validation &
          balance checks
          🔒
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth:
      "720px",
    margin: "auto",
    padding: "28px",
    background:
      "#F8FAFC",
    minHeight:
      "100vh",
    fontFamily:
      "Arial",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "22px",
  },

  small: {
    margin: 0,
    color:
      "#64748B",
  },

  title: {
    margin:
      "6px 0 0 0",
    fontSize:
      "34px",
  },

  badge: {
    background:
      "#EEF2FF",
    color:
      "#4F46E5",
    padding:
      "10px 16px",
    borderRadius:
      "999px",
    fontWeight:
      "700",
  },

  card: {
    background:
      "white",
    padding: "24px",
    borderRadius:
      "22px",
    boxShadow:
      "0 12px 28px rgba(0,0,0,0.06)",
  },

  topBox: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "18px",
    borderRadius:
      "18px",
    marginBottom:
      "22px",
  },

  topLabel: {
    margin: 0,
    opacity: 0.9,
    fontSize:
      "14px",
  },

  label: {
    display:
      "block",
    marginBottom:
      "8px",
    marginTop:
      "14px",
    fontWeight:
      "600",
    color:
      "#111827",
  },

  input: {
    width: "100%",
    padding:
      "14px 16px",
    border:
      "1px solid #E5E7EB",
    borderRadius:
      "12px",
    outline:
      "none",
    fontSize:
      "15px",
    boxSizing:
      "border-box",
  },

  button: {
    width: "100%",
    marginTop:
      "22px",
    padding:
      "14px",
    border: "none",
    borderRadius:
      "14px",
    background:
      "#4F46E5",
    color: "white",
    fontSize:
      "16px",
    fontWeight:
      "700",
    cursor:
      "pointer",
  },

  info: {
    marginTop:
      "20px",
    background:
      "white",
    padding: "18px",
    borderRadius:
      "18px",
    color:
      "#475569",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.05)",
  },
};

export default TransactionForm;