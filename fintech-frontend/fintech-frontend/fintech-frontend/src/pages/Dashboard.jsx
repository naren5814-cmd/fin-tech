import { useEffect, useState } from "react";

function Dashboard() {
  const [data, setData] =
    useState(null);

  const userId =
    localStorage.getItem(
      "user_id"
    );

  const userName =
    localStorage.getItem(
      "name"
    ) || "User";

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
  const sampleData = {
    balance: 25000,
    total_credit: 40000,
    total_debit: 15000,
    transaction_count: 8,

    recent_transactions: [
      {
        id: 1,
        type: "credit",
        amount: 5000,
        description: "Added Money"
      },
      {
        id: 2,
        type: "debit",
        amount: 1200,
        receiver_name: "Rahul"
      },
      {
        id: 3,
        type: "debit",
        amount: 850,
        receiver_name: "Arun"
      },
      {
        id: 4,
        type: "credit",
        amount: 3000,
        description: "Refund"
      }
    ]
  };

  setData(sampleData);
};

  if (!data) {
    return (
      <div
        style={
          styles.loadingPage
        }
      >
        <h2>
          Loading
          Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div
        style={
          styles.header
        }
      >
        <div>
          <p
            style={
              styles.small
            }
          >
            Welcome Back 👋
          </p>

          <h1
            style={
              styles.title
            }
          >
            {userName}
          </h1>
        </div>

        <div
          style={
            styles.badge
          }
        >
          Dashboard
        </div>
      </div>

      {/* Main Balance */}
      <div
        style={
          styles.balanceCard
        }
      >
        <p
          style={
            styles.label
          }
        >
          Wallet
          Balance
        </p>

        <h2
          style={
            styles.balance
          }
        >
          ₹
          {data.balance}
        </h2>

        <p
          style={
            styles.sub
          }
        >
          Updated
          Live
        </p>
      </div>

      {/* Stats */}
      <div
        style={
          styles.grid
        }
      >
        <div
          style={
            styles.card
          }
        >
          <p
            style={
              styles.cardLabel
            }
          >
            Total
            Credit
          </p>

          <h3
            style={{
              color:
                "#22C55E",
              margin: 0,
            }}
          >
            ₹
            {
              data.total_credit
            }
          </h3>
        </div>

        <div
          style={
            styles.card
          }
        >
          <p
            style={
              styles.cardLabel
            }
          >
            Total
            Debit
          </p>

          <h3
            style={{
              color:
                "#EF4444",
              margin: 0,
            }}
          >
            ₹
            {
              data.total_debit
            }
          </h3>
        </div>

        <div
          style={
            styles.card
          }
        >
          <p
            style={
              styles.cardLabel
            }
          >
            Transactions
          </p>

          <h3
            style={{
              margin: 0,
            }}
          >
            {
              data.transaction_count
            }
          </h3>
        </div>
      </div>

      {/* Recent */}
      <div
        style={
          styles.historyBox
        }
      >
        <div
          style={
            styles.historyHead
          }
        >
          <h3
            style={{
              margin: 0,
            }}
          >
            Recent
            Transactions
          </h3>

          <span
            style={
              styles.viewAll
            }
          >
            Latest
          </span>
        </div>

        {data
          .recent_transactions
          .length ===
        0 ? (
          <div
            style={
              styles.emptyBox
            }
          >
            <p>
              No
              transactions
              yet
            </p>
          </div>
        ) : (
          data.recent_transactions.map(
            (
              item
            ) => (
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
                    {
                      item.type
                    }
                  </small>
                </div>

                <span
                  style={{
                    color:
                      item.type ===
                      "credit"
                        ? "#22C55E"
                        : "#EF4444",
                    fontWeight:
                      "700",
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
  loadingPage: {
    minHeight:
      "100vh",
    display: "flex",
    justifyContent:
      "center",
    alignItems:
      "center",
    fontFamily:
      "Arial",
  },

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
      "22px",
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
      "34px",
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

  balanceCard: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "26px",
    borderRadius:
      "22px",
    marginBottom:
      "24px",
    boxShadow:
      "0 14px 28px rgba(79,70,229,0.18)",
  },

  label: {
    margin: 0,
    opacity: 0.9,
  },

  balance: {
    margin:
      "10px 0",
    fontSize:
      "42px",
  },

  sub: {
    margin: 0,
    opacity: 0.8,
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: "16px",
    marginBottom:
      "24px",
  },

  card: {
    background:
      "white",
    padding: "20px",
    borderRadius:
      "18px",
    boxShadow:
      "0 10px 22px rgba(0,0,0,0.05)",
  },

  cardLabel: {
    marginTop: 0,
    color:
      "#64748B",
    marginBottom:
      "10px",
  },

  historyBox: {
    background:
      "white",
    padding: "22px",
    borderRadius:
      "18px",
    boxShadow:
      "0 10px 22px rgba(0,0,0,0.05)",
  },

  historyHead: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    marginBottom:
      "14px",
  },

  viewAll: {
    color:
      "#4F46E5",
    fontWeight:
      "600",
    fontSize:
      "14px",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    padding:
      "14px 0",
    borderBottom:
      "1px solid #E5E7EB",
  },

  emptyBox: {
    textAlign:
      "center",
    padding:
      "30px",
    color:
      "#64748B",
    background:
      "#F8FAFC",
    borderRadius:
      "14px",
  },
};

export default Dashboard;