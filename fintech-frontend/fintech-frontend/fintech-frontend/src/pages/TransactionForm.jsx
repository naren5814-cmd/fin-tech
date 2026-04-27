import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TransactionForm() {
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Empty validation
    if (!mobile || !amount) {
      alert("Fill all fields");
      return;
    }

    // Mobile number validation
    if (!/^[0-9]{10}$/.test(mobile)) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    const sendAmount = Number(amount);

    // Amount validation
    if (isNaN(sendAmount) || sendAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    // Minimum amount
    if (sendAmount < 10) {
      alert("Minimum transfer is ₹10");
      return;
    }

    // Maximum amount
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender_id: userId,
            receiver_mobile: mobile,
            amount: sendAmount,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Money Sent Successfully");
        navigate("/history");
      } else {
        alert(data.detail || "Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>Send Money</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Receiver Mobile Number"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value)
          }
        />

        <input
          className="input"
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <button
          className="btn"
          disabled={loading}
        >
          {loading
            ? "Sending..."
            : "Send Money"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;