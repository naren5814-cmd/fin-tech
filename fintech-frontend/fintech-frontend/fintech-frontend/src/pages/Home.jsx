import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);

  const userId = localStorage.getItem("user_id");
  const userName =
    localStorage.getItem("name") || "User";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Wallet
      const walletRes = await fetch(
        `http://127.0.0.1:8000/wallet/${userId}`
      );
      const walletData = await walletRes.json();

      setBalance(walletData.balance || 0);

      // Recent History
      const txRes = await fetch(
        `http://127.0.0.1:8000/user_transaction/${userId}`
      );

      const txData = await txRes.json();

      setHistory(
        (txData.transactions || []).slice(0, 3)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
      <div style={styles.icon}>{icon}</div>
      <h4 style={styles.actionTitle}>
        {title}
      </h4>
      <p style={styles.actionSub}>{sub}</p>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <p style={styles.small}>
            Welcome back 👋
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

      {/* Wallet Card */}
      <div style={styles.walletCard}>
        <p style={styles.walletLabel}>
          Available Balance
        </p>

        <h2 style={styles.balance}>
          ₹{balance}
        </h2>

        <p style={styles.walletSub}>
          Updated just now
        </p>
      </div>

      {/* Actions */}
      <h3 style={styles.sectionTitle}>
        Quick Actions
      </h3>

      <div style={styles.grid}>
        {actionCard(
          "Add Money",
          "Top up wallet instantly",
          () => navigate("/addmoney"),
          "💳"
        )}

        {actionCard(
          "Send Money",
          "Transfer securely",
          () =>
            navigate("/transaction"),
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
          () => navigate("/account"),
          "👤"
        )}
      </div>

      {/* Recent Activity */}
      <h3 style={styles.sectionTitle}>
        Recent Activity
      </h3>

      <div style={styles.historyBox}>
        {history.length === 0 ? (
          <p style={styles.empty}>
            No transactions yet
          </p>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
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
                ₹{item.amount}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Insight Card */}
      <div style={styles.insight}>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
          }}
        >
          Smart Insight
        </p>

        <h3
          style={{
            marginTop: "8px",
          }}
        >
          Keep tracking your daily
          spending for better
          savings 💡
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
    justifyContent:
      "space-between",
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
    fontWeight: "600",
  },

  walletCard: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "30px",
    borderRadius: "22px",
    boxShadow:
      "0 18px 35px rgba(79,70,229,0.20)",
    marginBottom: "26px",
  },

  walletLabel: {
    margin: 0,
    opacity: 0.9,
  },

  balance: {
    margin: "12px 0",
    fontSize: "42px",
  },

  walletSub: {
    margin: 0,
    opacity: 0.8,
    fontSize: "14px",
  },

  sectionTitle: {
    marginBottom: "16px",
    marginTop: "10px",
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
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.06)",
    transition: "0.2s",
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
    boxShadow:
      "0 10px 24px rgba(0,0,0,0.06)",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
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