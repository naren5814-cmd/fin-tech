import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  const userId =
    localStorage.getItem("user_id");

  const userName =
    localStorage.getItem("name") || "User";

  // IMPORTANT FIX
  const fetchedRef = useRef(false);

  // =====================================
  // LOAD DATA
  // =====================================

  const loadData = async () => {

    try {

      console.log("HOME LOAD HIT");

      // =========================
      // WALLET
      // =========================

      const walletRes = await fetch(
        `http://127.0.0.1:8000/wallet/${userId}`
      );

      const walletData =
        await walletRes.json();

      console.log(
        "REAL WALLET:",
        walletData
      );

      // ONLY API VALUE
      setBalance(
        Number(walletData.balance) || 0
      );

      const cachedBalance =
        localStorage.getItem("wallet_balance");

      const [balance, setBalance] =
        useState(
          Number(cachedBalance) || 0
        );

      // =========================
      // TRANSACTIONS
      // =========================

      const txRes = await fetch(
        `http://127.0.0.1:8000/transactions/${userId}`
      );

      const txData =
        await txRes.json();

      console.log(
        "TX DATA:",
        txData
      );

      let tx = [];

      if (
        Array.isArray(
          txData.transactions
        )
      ) {

        tx = txData.transactions;

      }

      tx.sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setHistory(tx.slice(0, 3));

    } catch (error) {

      console.log(
        "HOME ERROR:",
        error
      );
    }
  };

  // =====================================
  // USE EFFECT
  // =====================================

useEffect(() => {

if (!userId || userId === "null") {
navigate("/login");
return;
}

const fetchData = async () => {

try {

  console.log("FETCHING WALLET");

  const walletRes = await fetch(
    `http://127.0.0.1:8000/wallet/${userId}`
  );

  const walletData = await walletRes.json();

  console.log("FINAL WALLET:", walletData);

  setBalance(
    Number(walletData.balance) || 0
  );

  const txRes = await fetch(
    `http://127.0.0.1:8000/transactions/${userId}`
  );

  const txData = await txRes.json();

  if (
    Array.isArray(txData.transactions)
  ) {

    const sortedTx =
      [...txData.transactions].sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

    setHistory(sortedTx.slice(0, 3));
  }

} catch (error) {

  console.log(error);

}

};

fetchData();

}, []);

useEffect(() => {
    if (fetchedRef.current) return; 
    
    const loadData = async () => {
        fetchedRef.current = true; 
    };

    loadData();
}, []);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");
  };

  // =====================================
  // ACTION CARD
  // =====================================

  const actionCard = (
    title,
    sub,
    click,
    icon
  ) => (

    <div
      style={styles.actionCard}
      onClick={click}
    >

      <div style={styles.icon}>
        {icon}
      </div>

      <h4 style={styles.actionTitle}>
        {title}
      </h4>

      <p style={styles.actionSub}>
        {sub}
      </p>

    </div>
  );

  return (

    <div style={styles.page}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>

          <p style={styles.small}>
            Welcome Back 👋
          </p>

          <h1 style={styles.name}>
            {userName}
          </h1>

        </div>

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* WALLET */}

      <div style={styles.walletCard}>

        <p style={styles.walletLabel}>
          Available Balance
        </p>

        <h2 style={styles.balance}>
          ₹{Number(balance).toLocaleString("en-IN")}
        </h2>

        <p style={styles.walletSub}>
          Updated just now
        </p>

      </div>

      {/* QUICK ACTIONS */}

      <h3 style={styles.sectionTitle}>
        Quick Actions
      </h3>

      <div style={styles.grid}>

        {actionCard(
          "Add Money",
          "Top up wallet instantly",
          () => navigate("/add-money"),
          "💳"
        )}

        {actionCard(
          "Send Money",
          "Transfer securely",
          () => navigate("/transaction"),
          "📤"
        )}

        {actionCard(
          "History",
          "See all transactions",
          () => navigate("/history"),
          "📜"
        )}

        {actionCard(
          "Account",
          "Manage profile",
          () => navigate("/account-link"),
          "👤"
        )}

      </div>

      {/* HISTORY */}

      <h3 style={styles.sectionTitle}>
        Recent Activity
      </h3>

      <div style={styles.historyBox}>

        {history.length === 0 ? (

          <p style={styles.empty}>
            No transactions yet
          </p>

        ) : (

          history.map((item, index) => (

            <div
              key={item.id || index}
              style={styles.row}
            >

              <div>

                <p
                  style={{
                    margin: 0,
                    fontWeight: "600",
                  }}
                >
                  {item.receiver_name ||
                    item.description ||
                    item.type}
                </p>

                <small
                  style={{
                    color: "#64748B",
                  }}
                >
                  {item.type}
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

      {/* INSIGHT */}

      <div style={styles.insight}>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
          }}
        >
          Smart Insight
        </p>

        <h3 style={{ marginTop: "8px" }}>
          Keep tracking your daily spending
          for better savings 💡
        </h3>

      </div>

    </div>
  );
}

const styles = {

  page: {
    maxWidth: "1000px",
    margin: "auto",
    padding: "28px",
    fontFamily: "Arial",
    background: "#F8FAFC",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },

  small: {
    margin: 0,
    color: "#64748B",
  },

  name: {
    margin: "6px 0 0 0",
    fontSize: "34px",
  },

  logoutBtn: {
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    background: "#EF4444",
    color: "white",
    cursor: "pointer",
  },

  walletCard: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "30px",
    borderRadius: "22px",
    marginBottom: "26px",
  },

  walletLabel: {
    margin: 0,
  },

  balance: {
    margin: "12px 0",
    fontSize: "42px",
  },

  walletSub: {
    margin: 0,
    fontSize: "14px",
  },

  sectionTitle: {
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
    padding: "18px",
    borderRadius: "18px",
    cursor: "pointer",
  },

  icon: {
    fontSize: "28px",
  },

  actionTitle: {
    margin: "12px 0 6px 0",
  },

  actionSub: {
    margin: 0,
    fontSize: "13px",
    color: "#64748B",
  },

  historyBox: {
    background: "white",
    padding: "20px",
    borderRadius: "18px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom:
      "1px solid #E5E7EB",
  },

  empty: {
    color: "#64748B",
    margin: 0,
  },

  insight: {
    marginTop: "26px",
    background:
      "linear-gradient(135deg,#0F172A,#1E293B)",
    color: "white",
    padding: "24px",
    borderRadius: "18px",
  },
};

export default Home;