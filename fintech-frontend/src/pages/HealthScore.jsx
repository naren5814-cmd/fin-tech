import { useEffect, useState } from "react";

function HealthScore() {

  const [data, setData] = useState(null);

  useEffect(() => {
    loadHealthScore();
  }, []);

  const loadHealthScore = async () => {

    try {

      const userId =
        localStorage.getItem("user_id");

      const res = await fetch(
        `http://127.0.0.1:8000/health-score/${userId}`
      );

      const result = await res.json();

      console.log(result);

      setData(result);

    } catch (error) {

      console.log(error);

    }
  };

  // =========================
  // LOADING
  // =========================
  if (!data) {

    return (
      <h2 style={{ textAlign: "center" }}>
        Loading...
      </h2>
    );
  }

  const score =
    data.fin_health_score || 0;

  const getStatus = () => {

    if (score >= 85)
      return "Excellent 💚";

    if (score >= 70)
      return "Good 👍";

    if (score >= 50)
      return "Average 🟡";

    return "Needs Improvement 🔴";
  };

  return (
    <div style={styles.page}>

      <h1 style={styles.title}>
        Financial Health Score
      </h1>

      {/* SCORE CARD */}
      <div style={styles.scoreCard}>

        <h3>Your Score</h3>

        <div style={styles.circle}>
          {score}
        </div>

        <p style={styles.status}>
          {getStatus()}
        </p>

      </div>

      {/* STATS */}
      <div style={styles.grid}>

        <div style={styles.card}>
          <p>Wallet Balance</p>

          <h3>
            ₹{data.balance}
          </h3>
        </div>

        <div style={styles.card}>
          <p>Total Credit</p>

          <h3 style={{ color: "green" }}>
            ₹{data.total_credit}
          </h3>
        </div>

        <div style={styles.card}>
          <p>Total Debit</p>

          <h3 style={{ color: "red" }}>
            ₹{data.total_debit}
          </h3>
        </div>

        <div style={styles.card}>
          <p>Transactions</p>

          <h3>
            {data.transaction_count}
          </h3>
        </div>

      </div>

    </div>
  );
}

const styles = {

  page: {
    maxWidth: "900px",
    margin: "auto",
    padding: "30px",
    fontFamily: "Arial",
  },

  title: {
    marginBottom: "20px",
  },

  scoreCard: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "30px",
    borderRadius: "18px",
    textAlign: "center",
    marginBottom: "25px",
  },

  circle: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    background: "white",
    color: "#4F46E5",
    fontSize: "36px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
  },

  status: {
    fontSize: "18px",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(150px,1fr))",
    gap: "15px",
  },

  card: {
    background: "#FFFFFF",
    padding: "20px",
    borderRadius: "14px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.2)",
  },
};

export default HealthScore;