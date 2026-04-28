import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Pages/LogoutButton";

function Account() {
  const navigate = useNavigate();

  const [name, setName] =
    useState("");
  const [mobile, setMobile] =
    useState("");
  const [account, setAccount] =
    useState("");
  const [ifsc, setIfsc] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const userId =
    localStorage.getItem(
      "user_id"
    );

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (loading) return;

      if (
        !name ||
        !mobile ||
        !account ||
        !ifsc
      ) {
        alert(
          "Fill all fields"
        );
        return;
      }

      if (
        !/^[0-9]{10}$/.test(
          mobile
        )
      ) {
        alert(
          "Enter valid mobile number"
        );
        return;
      }

      try {
        setLoading(true);

        const res =
          await fetch(
            "http://127.0.0.1:8000/account-details",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                {
                  user_id:
                    userId,
                  name,
                  mobile_number:
                    mobile,
                  account_number:
                    account,
                  ifsc_code:
                    ifsc,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (
          data.success
        ) {
          navigate(
            "/wallet"
          );
        } else {
          alert(
            data.detail ||
              "Failed"
          );
        }
      } catch (
        error
      ) {
        console.log(
          error
        );
        alert(
          "Server error"
        );
      } finally {
        setLoading(false);
      }
    };

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
            Profile Setup
          </p>

          <h1
            style={
              styles.title
            }
          >
            Account
            Details
          </h1>
        </div>
      </div>

      {/* Card */}
      <div
        style={
          styles.card
        }
      >
        <div
          style={
            styles.topBox
          }
        >
          <p
            style={{
              margin: 0,
              opacity: 0.9,
            }}
          >
            Complete
            your banking
            profile
          </p>

          <h3
            style={{
              margin:
                "8px 0 0 0",
            }}
          >
            Safe &
            Secure
            Information
          </h3>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <label
            style={
              styles.label
            }
          >
            Full Name
          </label>

          <input
            style={
              styles.input
            }
            placeholder="Enter your name"
            value={name}
            onChange={(
              e
            ) =>
              setName(
                e.target
                  .value
              )
            }
          />

          <label
            style={
              styles.label
            }
          >
            Mobile
            Number
          </label>

          <input
            style={
              styles.input
            }
            placeholder="10 digit mobile"
            value={
              mobile
            }
            onChange={(
              e
            ) =>
              setMobile(
                e.target
                  .value
              )
            }
          />

          <label
            style={
              styles.label
            }
          >
            Account
            Number
          </label>

          <input
            style={
              styles.input
            }
            placeholder="Enter account number"
            value={
              account
            }
            onChange={(
              e
            ) =>
              setAccount(
                e.target
                  .value
              )
            }
          />

          <label
            style={
              styles.label
            }
          >
            IFSC Code
          </label>

          <input
            style={
              styles.input
            }
            placeholder="Enter IFSC"
            value={ifsc}
            onChange={(
              e
            ) =>
              setIfsc(
                e.target
                  .value
              )
            }
          />

          <button
            type="submit"
            style={{
              ...styles.button,
              opacity:
                loading
                  ? 0.8
                  : 1,
            }}
            disabled={
              loading
            }
          >
            {loading
              ? "Saving..."
              : "Submit"}
          </button>
        </form>

        <div
          style={{
            marginTop:
              "16px",
          }}
        >
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth:
      "720px",
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
      "34px",
  },

  card: {
    background:
      "white",
    padding: "24px",
    borderRadius:
      "22px",
    boxShadow:
      "0 12px 28px rgba(0,0,0,0.06)",
  },

  topBox: {
    background:
      "linear-gradient(135deg,#4F46E5,#06B6D4)",
    color: "white",
    padding: "18px",
    borderRadius:
      "18px",
    marginBottom:
      "22px",
  },

  label: {
    display:
      "block",
    marginTop:
      "14px",
    marginBottom:
      "8px",
    fontWeight:
      "600",
  },

  input: {
    width: "100%",
    padding:
      "14px 16px",
    border:
      "1px solid #E5E7EB",
    borderRadius:
      "12px",
    fontSize:
      "15px",
    boxSizing:
      "border-box",
    outline:
      "none",
  },

  button: {
    width: "100%",
    marginTop:
      "22px",
    padding:
      "14px",
    border: "none",
    borderRadius:
      "14px",
    background:
      "#4F46E5",
    color: "white",
    fontWeight:
      "700",
    fontSize:
      "16px",
    cursor:
      "pointer",
  },
};

export default Account;