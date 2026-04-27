import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function WalletCard() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, []);

  // Auto refresh when page focus again
  useEffect(() => {
    window.addEventListener("focus", loadData);

    return () => {
      window.removeEventListener("focus", loadData);
    };
  }, []);

  const loadData = async () => {
    try {
      const walletRes = await fetch(
        `http://127.0.0.1:8000/wallet/${userId}`
      );
      const walletData = await walletRes.json();

      setBalance(walletData.balance || 0);

      const txRes = await fetch(
        `http://127.0.0.1:8000/user_transaction/${userId}`
      );

      const txData = await txRes.json();

      setHistory(
        (txData.transactions || []).slice(0, 5)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card">
      <h2>My Wallet</h2>

      <h1 style={{ color: "#4F46E5" }}>
        ₹{balance}
      </h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button
          className="btn"
          onClick={() =>
            navigate("/add-money")
          }
        >
          Add Money
        </button>

        <button
          className="btn"
          onClick={() =>
            navigate("/transaction")
          }
        >
          Send Money
        </button>

        <button
          className="btn"
          onClick={() =>
            navigate("/history")
          }
        >
          History
        </button>
      </div>

      <h3 style={{ marginTop: "25px" }}>
        Recent Transactions
      </h3>

      {history.map((item) => (
        <div
          key={item.id}
          className="history-item"
        >
          <span>{item.type}</span>

          <span
            style={{
              color:
                item.type === "credit"
                  ? "green"
                  : "red",
            }}
          >
            {item.type === "credit"
              ? "+"
              : "-"}
            ₹{item.amount}
          </span>
        </div>
      ))}
    </div>
  );
}

export default WalletCard;