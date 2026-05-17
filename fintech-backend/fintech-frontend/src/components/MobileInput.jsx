import { useEffect, useState } from "react";

function MobileInput({
  mobile,
  setMobile,
}) {
  const [userName, setUserName] =
    useState("");
  const [checking, setChecking] =
    useState(false);

  const handleChange = (e) => {
    let value =
      e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);
    setMobile(value);
  };

  const formatMobile = (num) => {
    if (num.length <= 3) return num;
    if (num.length <= 6)
      return `${num.slice(0, 3)} ${num.slice(3)}`;

    return `${num.slice(0, 3)} ${num.slice(
      3,
      6
    )} ${num.slice(6)}`;
  };

  // Auto fetch receiver name
  useEffect(() => {
    const getUser = async () => {
      if (mobile.length !== 10) {
        setUserName("");
        return;
      }

      try {
        setChecking(true);

        const res = await fetch(
          `http://127.0.0.1:8000/user-by-mobile/${mobile}`
        );

        const data = await res.json();

        if (data.success) {
          setUserName(data.name);
        } else {
          setUserName("");
        }
      } catch {
        setUserName("");
      } finally {
        setChecking(false);
      }
    };

    getUser();
  }, [mobile]);

  const valid =
    mobile.length === 10;

  return (
    <div style={styles.wrap}>

        

      <label style={styles.label}>
        Receiver Number
      </label>

      <div style={styles.box}>
        <span style={styles.prefix}>
          +91
        </span>

        <input
          type="tel"
          value={formatMobile(mobile)}
          onChange={handleChange}
          placeholder="987 654 3210"
          style={styles.input}
        />

        {valid && (
          <span style={styles.tick}>
            ✔
          </span>
        )}
      </div>

      {checking && (
        <small style={styles.gray}>
          Checking user...
        </small>
      )}

      {userName && (
        <small style={styles.green}>
          Receiver: {userName}
        </small>
      )}

      {valid &&
        !checking &&
        !userName && (
          <small style={styles.red}>
            User not found
          </small>
        )}
    </div>
  );
}

const styles = {
  wrap: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
  },

  box: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "14px",
    background: "white",
  },

  prefix: {
    marginRight: "10px",
    color: "#4F46E5",
    fontWeight: "700",
  },

  input: {
    border: "none",
    outline: "none",
    flex: 1,
    fontSize: "16px",
  },

  tick: {
    color: "green",
    fontWeight: "700",
  },

  gray: {
    color: "#6B7280",
    display: "block",
    marginTop: "8px",
  },

  green: {
    color: "#16A34A",
    display: "block",
    marginTop: "8px",
    fontWeight: "600",
  },

  red: {
    color: "#DC2626",
    display: "block",
    marginTop: "8px",
    fontWeight: "600",
  },
};

export default MobileInput;