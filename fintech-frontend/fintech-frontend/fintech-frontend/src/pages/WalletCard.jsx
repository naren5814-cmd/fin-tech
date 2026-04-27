import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function WalletCard() {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // wallet balance
    const walletRes = await fetch(
      `http://127.0.0.1:8000/wallet/${userId}`
    );
    const walletData = await walletRes.json();
    setBalance(walletData.balance);

    // last 5 transactions
    const txRes = await fetch(
      `http://127.0.0.1:8000/user_transaction/${userId}`
    );
    const txData = await txRes.json();

    setHistory((txData.transactions || txData).slice(0, 5));
  };

  return (
    <div className="card">
      <p className="subtext">My Wallet</p>
      <h2 className="balance">₹{balance}</h2>

      <h3 style={{ marginTop: "20px" }}>Last 5 Transactions</h3>

      {history.map((item) => (
        <div key={item.id} className="history-item">
          <span>{item.type}</span>

          <span
            style={{
              color:
                item.type === "credit"
                  ? "#22C55E"
                  : "#EF4444",
            }}
          >
            {item.type === "credit" ? "+" : "-"}₹{item.amount}
          </span>
        </div>
      ))}

       <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <button
          className="btn"
          onClick={() => navigate("/transaction")}
        >
          Transaction
        </button>

        <button
          className="btn"
          onClick={() => navigate("/history")}
        >
          History
        </button>
      </div>

    </div>
  );
}

export default WalletCard;