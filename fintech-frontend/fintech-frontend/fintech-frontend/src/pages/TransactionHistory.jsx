import { useEffect, useState } from "react";

function TransactionHistory() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [items, filter]);

  const loadHistory = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/user_transaction/${userId}`
      );

      const data = await res.json();

      setItems(data.transactions || []);
    } catch (error) {
      console.log(error);
    }
  };

  const applyFilter = () => {
    if (filter === "credit") {
      setFiltered(
        items.filter(
          (item) => item.type === "credit"
        )
      );
    } else if (filter === "debit") {
      setFiltered(
        items.filter(
          (item) => item.type === "debit"
        )
      );
    } else {
      setFiltered(items);
    }
  };

  return (
    <div className="card">
      <h2>Transaction History</h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
          marginBottom: "20px",
        }}
      >
        <button
          className="btn"
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className="btn"
          onClick={() => setFilter("credit")}
        >
          Credit
        </button>

        <button
          className="btn"
          onClick={() => setFilter("debit")}
        >
          Debit
        </button>
      </div>

      {/* Empty State UI */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            background: "#F8FAFC",
            borderRadius: "14px",
            border: "1px dashed #CBD5E1",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: "#475569",
            }}
          >
            No Transactions Yet
          </h3>

          <p
            style={{
              margin: 0,
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Your transaction history will
            appear here after money
            transfer or add money.
          </p>
        </div>
      ) : (
        filtered.map((item) => (
          <div
            key={item.id}
            className="history-item"
          >
            <div>
              <p style={{ margin: 0 }}>
                {item.receiver_name ||
                  item.description}
              </p>

              <small>
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </small>
            </div>

            <span
              style={{
                fontWeight: "700",
                color:
                  item.type === "credit"
                    ? "#22C55E"
                    : "#EF4444",
              }}
            >
              {item.type === "credit"
                ? "+"
                : "-"}
              ₹{item.amount}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default TransactionHistory;