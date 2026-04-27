import { useState } from "react";
import { useNavigate } from "react-router-dom";

function TransactionForm() {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");

  const senderId = localStorage.getItem("9185630c-c7d5-4b41-a437-97fd9fa99b45");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/send-money", {
        method: "POST",
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
        sender_id: senderId,
        receiver_mobile: mobile,
        amount: Number(amount)
  })
});

      const data = await res.json();

      if (res.ok) {
        navigate("/history");
      } else {
        alert(data.detail || "Failed");
      }

    } catch (error) {
      alert("Server Error");
    }
  };

  return (
    <div className="card form-card">
      <h2>Send Money</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Receiver Mobile"
          onChange={(e) => setMobile(e.target.value)}
        />

        <input
          className="input"
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="btn" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;