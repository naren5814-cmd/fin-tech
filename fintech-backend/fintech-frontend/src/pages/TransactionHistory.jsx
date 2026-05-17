import { useEffect, useState } from "react";

function TransactionHistory() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Getting userId - adding a fallback just in case
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchHistory();
  }, [userId]); // Re-fetch if userId changes

  useEffect(() => {
    applyFilter();
  }, [items, filter, search]);

  const fetchHistory = async () => {
    if (!userId) {
      console.error("User ID missing in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:8000/transactions/${userId}`);
      const data = await res.json();

      console.log("HISTORY DATA RECEIVED:", data);

      if (data.success && Array.isArray(data.transactions)) {
        // Sorting by date (Newest first) before setting state
        const sortedData = [...data.transactions].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setItems(sortedData);
        setFiltered(sortedData);
      } else {
        console.warn("No transactions found or success is false");
        setItems([]);
        setFiltered([]);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let data = [...items];

    if (filter !== "all") {
      data = data.filter((item) => item.type?.toLowerCase() === filter.toLowerCase());
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((item) => 
        (item.receiver_name?.toLowerCase().includes(query)) ||
        (item.receiver_mobile?.includes(query)) ||
        (item.description?.toLowerCase().includes(query))
      );
    }
    setFiltered(data);
  };

  const chipStyle = (active) => ({
    border: "none",
    padding: "10px 18px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "0.3s",
    background: active ? "#4F46E5" : "#E2E8F0",
    color: active ? "white" : "#475569",
  });

  const formatDate = (value) => {
    if (!value) return "No Date";
    try {
      return new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return value;
    }
  };

const handleSend = async () => {
    if (isProcessing) return; // Logic block
    setIsProcessing(true); // Lock it immediately

    const my_uuid = self.crypto.randomUUID(); // Fresh ID for every click

    try {
        const res = await fetch("http://127.0.0.1:8000/send-money", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                ...form, 
                user_id: userId,
                tx_uuid: my_uuid // Send the lock ID
            })
        });
        
        // ... success logic ...
        navigate("/home");
    } catch (err) {
        setIsProcessing(false); // Only unlock on error
    }
};

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.small}>Wallet Records</p>
          <h1 style={styles.title}>Transaction History</h1>
        </div>
        <div style={styles.badge}>{filtered.length} Items</div>
      </div>

      {/* Search */}
      <input
        placeholder="Search by name, mobile, or note..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* Filter Row */}
      <div style={styles.filterRow}>
        <button style={chipStyle(filter === "all")} onClick={() => setFilter("all")}>All</button>
        <button style={chipStyle(filter === "credit")} onClick={() => setFilter("credit")}>Credit</button>
        <button style={chipStyle(filter === "debit")} onClick={() => setFilter("debit")}>Debit</button>
      </div>

      {/* Main List */}
      <div style={styles.card}>
        {loading ? (
          <div style={styles.emptyBox}><h3>Loading History...</h3></div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyBox}>
            <h3>No Records Found</h3>
            <p>Try changing your filters or search query.</p>
          </div>
        ) : (
          filtered.map((item, index) => (
            <div key={item.id || index} style={styles.row} onClick={() => setSelected(item)}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  ...styles.iconCircle,
                  background: item.type === "credit" ? "#DCFCE7" : "#FEE2E2",
                  color: item.type === "credit" ? "#15803D" : "#DC2626"
                }}>
                  {item.type === "credit" ? "↙" : "↗"}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "700", color: "#1E293B" }}>
                    {item.receiver_name || item.receiver_mobile || "Wallet Update"}
                  </p>
                  <small style={{ color: "#64748B" }}>{formatDate(item.created_at)}</small>
                </div>
              </div>
              <span style={{
                ...styles.amount,
                color: item.type === "credit" ? "#15803D" : "#DC2626",
              }}>
                {item.type === "credit" ? "+" : "-"} ₹{item.amount.toLocaleString("en-IN")}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Receipt Popup */}
      {selected && (
        <div style={styles.overlay} onClick={() => setSelected(null)}>
          <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ textAlign: "center", marginBottom: "5px" }}>Receipt</h2>
            <p style={{ textAlign: "center", color: "#64748B", fontSize: "13px" }}>TX-ID: {selected.id?.slice(0, 8)}</p>
            <div style={styles.line} />
            <div style={styles.receiptRow}><span>Status:</span> <span style={{ color: "green", fontWeight: "bold" }}>Success</span></div>
            <div style={styles.receiptRow}><span>Method:</span> <span>Wallet Transfer</span></div>
            <div style={styles.receiptRow}><span>To/From:</span> <span>{selected.receiver_name || "N/A"}</span></div>
            <div style={styles.receiptRow}><span>Mobile:</span> <span>{selected.receiver_mobile || "N/A"}</span></div>
            <div style={styles.receiptRow}><span>Note:</span> <span>{selected.description || "No note added"}</span></div>
            <div style={styles.line} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "bold" }}>
              <span>Total:</span>
              <span>₹{selected.amount}</span>
            </div>
            <button style={styles.closeBtn} onClick={() => setSelected(null)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: "800px", margin: "auto", padding: "20px", background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { margin: "5px 0", fontSize: "28px", color: "#1E293B" },
  small: { margin: 0, color: "#64748B", fontWeight: "500" },
  badge: { background: "#4F46E5", color: "white", padding: "6px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" },
  search: { width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "15px", fontSize: "16px", outline: "none" },
  filterRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  card: { background: "white", padding: "10px 20px", borderRadius: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" },
  iconCircle: { width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold", fontSize: "20px" },
  amount: { fontWeight: "800", fontSize: "17px" },
  emptyBox: { textAlign: "center", padding: "50px 20px", color: "#94A3B8" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
  popup: { width: "100%", maxWidth: "400px", background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" },
  receiptRow: { display: "flex", justifyContent: "space-between", margin: "10px 0", color: "#475569" },
  line: { height: "1px", background: "#E2E8F0", margin: "20px 0", borderStyle: "dashed" },
  closeBtn: { width: "100%", marginTop: "25px", padding: "15px", border: "none", borderRadius: "12px", background: "#4F46E5", color: "white", fontWeight: "bold", cursor: "pointer" }
};

export default TransactionHistory;