import { useEffect, useState } from "react";

function TransactionHistory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      if (!userId) {
        setError("User ID not found");
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/user_transaction/${userId}`
      );

      const data = await res.json();

      console.log("History API:", data);

      setItems(data.transactions || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load history");
    }
  };

  return (
    <div className="card form-card">
      <h2>Transaction History</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length === 0 ? (
        <p>No Transactions Found</p>
      ) : (
        items.map((item, index) => (
          <div
            key={item.id || index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #eee"
            }}
          >
            <div>
              <p style={{ margin: 0 }}>
                {item.receiver_name || item.description || "Transaction"}
              </p>

              <small>
                {item.created_at
                  ? item.created_at
                  : "No Date"}
              </small>
            </div>

            <span
              style={{
                color:
                  item.type === "credit"
                    ? "#22C55E"
                    : "#EF4444",
                fontWeight: "600"
              }}
            >
              {item.type === "credit" ? "+" : "-"}₹{item.amount}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionHistory;