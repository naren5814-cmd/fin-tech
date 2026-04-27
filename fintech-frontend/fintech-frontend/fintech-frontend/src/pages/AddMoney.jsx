import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMoney() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://127.0.0.1:8000/add-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Money Added Successfully");
        navigate("/");
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
      <h2>Add Money</h2>

      <form onSubmit={handleSubmit}>
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
          type="submit"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Money"}
        </button>
      </form>
    </div>
  );
}

export default AddMoney;