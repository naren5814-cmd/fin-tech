import { useEffect, useState } from "react";

function TransactionHistory() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [items, filter]);

  const loadHistory = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://127.0.0.1:8000/user_transaction/${userId}`
      );

      const data = await res.json();

      setItems(data.transactions || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    if (filter === "credit") {
      setFiltered(
        items.filter(
          (item) =>
            item.type === "credit"
        )
      );
    } else if (
      filter === "debit"
    ) {
      setFiltered(
        items.filter(
          (item) =>
            item.type === "debit"
        )
      );
    } else {
      setFiltered(items);
    }
  };

  const chipStyle = (
    active
  ) => ({
    border: "none",
    padding:
      "10px 16px",
    borderRadius:
      "999px",
    cursor: "pointer",
    fontWeight: "600",
    background: active
      ? "#4F46E5"
      : "#E5E7EB",
    color: active
      ? "white"
      : "#111827",
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.small}>
            Wallet Records
          </p>
          <h1 style={styles.title}>
            Transaction History
          </h1>
        </div>

        <div style={styles.badge}>
          {filtered.length} Items
        </div>
      </div>

      {/* Filter */}
      <div style={styles.filterRow}>
        <button
          style={chipStyle(
            filter === "all"
          )}
          onClick={() =>
            setFilter("all")
          }
        >
          All
        </button>

        <button
          style={chipStyle(
            filter ===
              "credit"
          )}
          onClick={() =>
            setFilter(
              "credit"
            )
          }
        >
          Credit
        </button>

        <button
          style={chipStyle(
            filter ===
              "debit"
          )}
          onClick={() =>
            setFilter(
              "debit"
            )
          }
        >
          Debit
        </button>
      </div>

      {/* Body */}
      <div style={styles.card}>
        {loading ? (
          <p style={styles.empty}>
            Loading...
          </p>
        ) : filtered.length ===
          0 ? (
          <div
            style={
              styles.emptyBox
            }
          >
            <h3
              style={{
                marginBottom:
                  "10px",
              }}
            >
              No
              Transactions
              Yet
            </h3>

            <p
              style={{
                margin: 0,
                color:
                  "#64748B",
              }}
            >
              Your history
              will appear
              here after
              add money or
              transfer.
            </p>
          </div>
        ) : (
          filtered.map(
            (item) => (
              <div
                key={
                  item.id
                }
                style={
                  styles.row
                }
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight:
                        "600",
                    }}
                  >
                    {item.receiver_name ||
                      item.description ||
                      item.type}
                  </p>

                  <small
                    style={{
                      color:
                        "#64748B",
                    }}
                  >
                    {new Date(
                      item.created_at
                    ).toLocaleString()}
                  </small>
                </div>

                <span
                  style={{
                    fontWeight:
                      "700",
                    color:
                      item.type ===
                      "credit"
                        ? "#22C55E"
                        : "#EF4444",
                  }}
                >
                  {item.type ===
                  "credit"
                    ? "+"
                    : "-"}
                  ₹
                  {
                    item.amount
                  }
                </span>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth:
      "1000px",
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
      "20px",
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
      "32px",
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

  filterRow: {
    display: "flex",
    gap: "10px",
    flexWrap:
      "wrap",
    marginBottom:
      "20px",
  },

  card: {
    background:
      "white",
    padding: "22px",
    borderRadius:
      "20px",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.06)",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    padding:
      "16px 0",
    borderBottom:
      "1px solid #E5E7EB",
  },

  empty: {
    textAlign:
      "center",
    color:
      "#64748B",
    margin: 0,
  },

  emptyBox: {
    textAlign:
      "center",
    padding:
      "40px 20px",
    background:
      "#F8FAFC",
    borderRadius:
      "16px",
    border:
      "1px dashed #CBD5E1",
  },
};

export default TransactionHistory;