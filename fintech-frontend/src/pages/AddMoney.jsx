import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function AddMoney() {

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const navigate = useNavigate();

  const { showToast } = useToast();

  const userId =
    localStorage.getItem("user_id");

  const userName =
    localStorage.getItem("name") || "User";

  // =========================
  // FORMAT AMOUNT
  // =========================

  const formatAmount = (value) => {

    const num =
      value.replace(/,/g, "");

    if (!num) return "";

    return Number(num).toLocaleString(
      "en-IN"
    );
  };

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {

    const raw =
      e.target.value.replace(/\D/g, "");

    setAmount(formatAmount(raw));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    const rawAmount = Number(
      amount.replace(/,/g, "")
    );

    // VALIDATION

    if (!rawAmount || rawAmount <= 0) {

      showToast(
        "error",
        "Enter valid amount"
      );

      return;
    }

    try {

      setLoading(true);

      console.log("ADD MONEY HIT");

      const res = await fetch(
        "http://127.0.0.1:8000/add-money",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
            amount: rawAmount,
          }),
        }
      );

      const data = await res.json();

      console.log("ADD MONEY RESPONSE:", data);

      if (data.success) {

        setReceipt({
          amount: rawAmount,
          name: userName,
          time:
            new Date().toLocaleString(),
        });

        showToast(
          "success",
          "Money added successfully"
        );

        setAmount("");

        // NAVIGATE AFTER 1 SEC

        setTimeout(() => {

          navigate("/home");

        }, 1000);

      } else {

        showToast(
          "error",
          data.detail || "Failed"
        );
      }

    } catch (error) {

      console.log(error);

      showToast(
        "error",
        "Server Error"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <h1>Add Money</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter Amount"
            value={amount}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.btn}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Add Money"}
          </button>

        </form>

      </div>

      {/* RECEIPT */}

      {receipt && (

        <div style={styles.receipt}>

          <h2>
            ✅ Money Added Successfully
          </h2>

          <p>
            <b>Name:</b>{" "}
            {receipt.name}
          </p>

          <p>
            <b>Amount:</b> ₹
            {receipt.amount.toLocaleString(
              "en-IN"
            )}
          </p>

          <p>
            <b>Date:</b>{" "}
            {receipt.time}
          </p>

          <p>
            <b>Status:</b> Success
          </p>

        </div>
      )}

    </div>
  );
}

const styles = {

  page: {
    maxWidth: "500px",
    margin: "auto",
    padding: "30px",
    fontFamily: "Arial",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.08)",
  },

  input: {
    width: "100%",
    padding: "14px",
    fontSize: "18px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginTop: "15px",
    marginBottom: "15px",
    boxSizing: "border-box",
  },

  btn: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#4F46E5",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  receipt: {
    marginTop: "25px",
    background: "#ECFDF5",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid #22C55E",
  },
};

export default AddMoney;