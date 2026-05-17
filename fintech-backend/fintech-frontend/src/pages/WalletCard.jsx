import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function WalletCard() {

  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [showBalance, setShowBalance] = useState(true);
  const [updatedTime, setUpdatedTime] = useState("");

  const navigate = useNavigate();

  const loadingRef = useRef(false);

  const userId = localStorage.getItem("user_id");

  const userName =
    localStorage.getItem("name") || "User";

  // =====================================
  // LOAD DATA
  // =====================================

  const loadData = async () => {

    // STOP MULTIPLE API CALLS
    if (loadingRef.current) {
      console.log("ALREADY LOADING");
      return;
    }

    loadingRef.current = true;

    try {

      console.log("WALLET FETCH START");

      // =========================
      // FETCH WALLET
      // =========================

      const walletRes = await fetch(
        `http://127.0.0.1:8000/wallet/${userId}`
      );

      const walletData = await walletRes.json();

      console.log(
        "FINAL WALLET API:",
        walletData
      );

      // IMPORTANT
      // ONLY ONE BALANCE UPDATE
      const latestBalance =
        Number(walletData.balance) || 0;

      console.log(
        "SETTING BALANCE:",
        latestBalance
      );

      setBalance(latestBalance);

      // =========================
      // FETCH TRANSACTIONS
      // =========================

      const txRes = await fetch(
        `http://127.0.0.1:8000/transactions/${userId}`
      );

      const txData = await txRes.json();

      console.log("TX DATA:", txData);

      let tx = [];

      if (
        Array.isArray(txData.transactions)
      ) {

        tx = txData.transactions;

      }

      tx.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setHistory(tx.slice(0, 3));

      setUpdatedTime(
        new Date().toLocaleTimeString()
      );

    } catch (error) {

      console.log(
        "WALLET ERROR:",
        error
      );

    } finally {

      loadingRef.current = false;
    }
  };

  // =====================================
  // USE EFFECT
  // =====================================

  useEffect(() => {

    if (!userId) return;

    console.log("USE EFFECT RUN");

    loadData();

  }, []);

  // =====================================
  // ACTION CARD
  // =====================================

  const actionCard = (
    title,
    icon,
    path
  ) => (
    <div
      style={styles.actionCard}
      onClick={() => navigate(path)}
    >
      <div style={styles.icon}>
        {icon}
      </div>

      <p style={styles.actionText}>
        {title}
      </p>
    </div>
  );

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.small}>
            Wallet Overview 👋
          </p>

          <h2 style={styles.name}>
            {userName}
          </h2>
        </div>
      </div>

      {/* Wallet Card */}
      <div style={styles.walletCard}>

        <p style={styles.label}>
          Available Balance
        </p>

        <div style={styles.balanceRow}>

          <h1 style={styles.balance}>
            {showBalance
              ? `₹${Number(balance).toLocaleString("en-IN")}`
              : "₹••••••"}
          </h1>

          <button
            style={styles.eyeBtn}
            onClick={() =>
              setShowBalance(!showBalance)
            }
          >
            {showBalance ? "👁️" : "🙈"}
          </button>

        </div>

        <p style={styles.sub}>
          Updated at {updatedTime}
        </p>

      </div>

      {/* Cashback */}
      <div style={styles.cashback}>
        🎁 Get ₹50 cashback on adding ₹1000+
      </div>

      {/* Low Balance */}
      {balance < 500 && (
        <div style={styles.warning}>
          ⚠️ Low Balance. Add money now.
        </div>
      )}

      {/* Actions */}
      <h3 style={styles.section}>
        Quick Actions
      </h3>

      <div style={styles.grid}>

        {actionCard(
          "Add Money",
          "💳",
          "/add-money"
        )}

        {actionCard(
          "Send Money",
          "📤",
          "/transaction"
        )}

        {actionCard(
          "History",
          "📜",
          "/history"
        )}

        {actionCard(
          "Health Score",
          "💚",
          "/health-score"
        )}

      </div>

      {/* History */}
      <h3 style={styles.section}>
        Recent Transactions
      </h3>

      <div style={styles.historyBox}>

        {history.length === 0 ? (

          <p style={styles.empty}>
            No transactions found
          </p>

        ) : (

          history.map((item, index) => (

            <div
              key={item?.id || index}
              style={styles.row}
            >

              <div>

                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  {item?.receiver_name ||
                    item?.description ||
                    "Transaction"}
                </p>

                <small
                  style={{
                    color: "#64748B",
                  }}
                >
                  {item?.created_at
                    ? new Date(
                        item.created_at
                      ).toLocaleString()
                    : ""}
                </small>

              </div>

              <span
                style={{
                  fontWeight: "700",
                  color:
                    item?.type === "credit"
                      ? "#22C55E"
                      : "#EF4444",
                }}
              >
                {item?.type === "credit"
                  ? "+"
                  : "-"}
                ₹{item?.amount || 0}
              </span>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "28px",
    background: "#F8FAFC",
    minHeight: "100vh",
    fontFamily: "Arial",
  },

  header: {
    marginBottom: "20px",
  },

  small: {
    margin: 0,
    color: "#64748B",
  },

  name: {
    margin: "6px 0 0 0",
    fontSize: "30px",
  },

  walletCard: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "28px",
    borderRadius: "22px",
    boxShadow:
      "0 16px 30px rgba(79,70,229,0.20)",
    marginBottom: "20px",
  },

  label: {
    margin: 0,
    opacity: 0.9,
  },

  balanceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  balance: {
    margin: "12px 0",
    fontSize: "42px",
  },

  eyeBtn: {
    border: "none",
    background: "white",
    padding: "10px 14px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "18px",
  },

  sub: {
    margin: 0,
    fontSize: "14px",
    opacity: 0.8,
  },

  cashback: {
    background: "#DCFCE7",
    color: "#166534",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "14px",
    fontWeight: "600",
  },

  warning: {
    background: "#FEF3C7",
    color: "#92400E",
    padding: "14px",
    borderRadius: "14px",
    marginBottom: "18px",
    fontWeight: "600",
  },

  section: {
    marginBottom: "16px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: "16px",
    marginBottom: "28px",
  },

  actionCard: {
    background: "white",
    borderRadius: "18px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: "28px",
  },

  actionText: {
    marginTop: "10px",
    fontWeight: "600",
  },

  historyBox: {
    background: "white",
    padding: "20px",
    borderRadius: "18px",
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.06)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom:
      "1px solid #E5E7EB",
  },

  empty: {
    color: "#64748B",
    margin: 0,
  },
};

export default WalletCard;

