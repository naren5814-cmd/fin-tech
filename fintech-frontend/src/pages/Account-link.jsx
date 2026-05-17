import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AccountLink() {
  const navigate = useNavigate();

  const [linked, setLinked] =
    useState(false);

  const [accounts, setAccounts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const userId =
    localStorage.getItem("user_id");

  useEffect(() => {
    loadAccount();
  }, []);

 const loadAccount = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      `http://127.0.0.1:8000/account-details/${userId}`
    );

    if (!res.ok) {
      throw new Error("Fetch failed");
    }

    const data = await res.json();
    console.log("API DATA:", data);

    if (data.linked && Array.isArray(data.data) && data.data.length > 0) {
      setLinked(true);
      setAccounts(data.data);
    } else {
      setLinked(false);
      setAccounts([]);
    }

  } catch (error) {
    console.log(error);
    setAccounts([])
    setLinked(false);
  } finally {
    setLoading(false);
  }
};

  const maskMobile = (num) => {
    if (!num) return "";
    return (
      "XXXXXXX" +
      String(num).slice(-3)
    );
  };

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Linked Accounts
          </h1>

          <p style={styles.sub}>
            Manage your connected
            bank accounts
          </p>
        </div>

        <button
          style={styles.plusBtn}
          onClick={() =>
            navigate(
              "/account-details"
            )
          }
        >
          +
        </button>
      </div>

      {/* No Account */}
      {!linked && (
        <div style={styles.empty}>
          <h2>No Account Linked</h2>

          <p>
            Add your first bank
            account to continue
          </p>

          <button
            style={styles.mainBtn}
            onClick={() =>
              navigate(
                "/account-details"
              )
            }
          >
            Link Account
          </button>
        </div>
      )}

      {/* Accounts */}
      {linked &&
        accounts.map(
          (item, index) => (
            <div
              key={index}
              style={styles.card}
            >
              <div
                style={
                  styles.topRow
                }
              >
                <h2
                  style={
                    styles.name
                  }
                >
                  {item.name}
                </h2>

                <span
                  style={
                    styles.badge
                  }
                >
                  Linked
                </span>
              </div>

              <div
                style={
                  styles.grid
                }
              >
                <div>
                  <p
                    style={
                      styles.label
                    }
                  >
                    Mobile
                  </p>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {maskMobile(
                      item.mobile_number
                    )}
                  </p>
                </div>

                <div>
                  <p
                    style={
                      styles.label
                    }
                  >
                    Account
                  </p>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      item.account_number
                    }
                  </p>
                </div>

                <div>
                  <p
                    style={
                      styles.label
                    }
                  >
                    IFSC
                  </p>

                  <p
                    style={
                      styles.value
                    }
                  >
                    {
                      item.ifsc_code
                    }
                  </p>
                </div>
              </div>
            </div>
          )
        )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "850px",
    margin: "auto",
    padding: "30px",
    minHeight: "100vh",
    fontFamily: "Arial",
    background:
      "linear-gradient(135deg,#EEF2FF,#F8FAFC,#FFFFFF)",
  },

  loaderWrap: {
    height: "100vh",
    display: "flex",
    justifyContent:
      "center",
    alignItems: "center",
    fontFamily: "Arial",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "28px",
    background:
      "rgba(255,255,255,0.8)",
    padding: "22px",
    borderRadius: "22px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  },

  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: "800",
    color: "#111827",
  },

  sub: {
    marginTop: "6px",
    color: "#6B7280",
    fontSize: "14px",
  },

  plusBtn: {
    width: "52px",
    height: "52px",
    border: "none",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg,#4F46E5,#7C3AED)",
    color: "white",
    fontSize: "30px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow:
      "0 10px 25px rgba(79,70,229,0.30)",
  },

  empty: {
    background: "white",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.06)",
  },

  mainBtn: {
    marginTop: "15px",
    padding:
      "14px 24px",
    border: "none",
    borderRadius: "12px",
    background:
      "#4F46E5",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  card: {
    background: "white",
    padding: "24px",
    borderRadius: "22px",
    marginBottom: "18px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)",
  },

  topRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  name: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
  },

  badge: {
    background: "#DCFCE7",
    color: "#166534",
    padding:
      "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "1fr",
    gap: "18px",
  },

  label: {
    margin: 0,
    color: "#6B7280",
    fontSize: "13px",
    marginBottom: "5px",
  },

  value: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
  },
};

export default AccountLink;