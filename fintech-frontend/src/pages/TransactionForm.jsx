import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function TransactionForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // State Management
  const [mobile, setMobile] = useState("");
  const [displayMobile, setDisplayMobile] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const userId = localStorage.getItem("user_id");

  // 1. Mobile Input & User Lookup Logic
  const handleMobile = async (e) => {
    let clean = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(clean);

    const formatted = clean.replace(/(\d{3})(\d{3})(\d{0,4})/, "$1 $2 $3").trim();
    setDisplayMobile(formatted);

    if (clean.length < 10) {
      setReceiverName("");
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/user-by-mobile/${clean}`);
      const data = await res.json();
      if (data.success) {
        setReceiverName(data.name);
      } else {
        setReceiverName("User Not Found");
      }
    } catch (error) {
      setReceiverName("User Not Found");
    }
  };

  // 2. Amount Input Logic
  const handleAmount = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setAmount(value);
    if (!value) {
      setDisplayAmount("");
      return;
    }
    setDisplayAmount(Number(value).toLocaleString("en-IN"));
  };

  // 3. Final Transaction Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (loading) return;
    if (mobile.length !== 10 || !amount || Number(amount) <= 0) {
      showToast("error", "Please enter a valid mobile and amount");
      return;
    }
    if (receiverName === "User Not Found" || !receiverName) {
      showToast("error", "Valid receiver required");
      return;
    }

    setLoading(true);

    // UNIQUE ID GENERATION (Idempotency)
    const current_tx_id = self.crypto.randomUUID();

    // PAYLOAD (Matching your image_6332bf.png columns)
    const payload = {
      user_id: userId,
      receiver_mobile: mobile,
      amount: parseFloat(amount),
      descriptior: note || "No Note", // Matching 'descriptior' spelling in DB
      tx_uuid: current_tx_id
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/send-money", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // SUCCESS HANDLING
        const now = new Date();
        setReceipt({
          name: receiverName,
          mobile: mobile,
          amount: displayAmount,
          note: note || "No Note",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          txn: current_tx_id, // Use the generated UUID
        });

        setShowPopup(true);
        showToast("success", "Money sent successfully ✅");
      } else {
        showToast("error", data.detail || "Transaction failed");
      }
    } catch (err) {
      console.error("SEND ERROR:", err);
      showToast("error", "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.banner}>
            <p style={styles.small}>Secure Transfer</p>
            <h2 style={styles.head}>Fast & Safe Payment</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Mobile Field */}
            <label style={styles.label}>Receiver Mobile</label>
            <div style={styles.inputBox}>
              <span style={styles.code}>+91</span>
              <input
                type="text"
                placeholder="Enter Mobile Number"
                value={displayMobile}
                onChange={handleMobile}
                style={styles.input}
              />
              {receiverName && receiverName !== "User Not Found" && (
                <span style={styles.tick}>✔</span>
              )}
            </div>
            {receiverName && (
              <p style={{ color: receiverName === "User Not Found" ? "#ef4444" : "#10b981", marginTop: "8px", fontWeight: "600", fontSize: "14px" }}>
                {receiverName}
              </p>
            )}

            {/* Amount Field */}
            <label style={{ ...styles.label, marginTop: "20px" }}>Amount (₹)</label>
            <input
              type="text"
              value={displayAmount}
              onChange={handleAmount}
              placeholder="Enter amount"
              style={styles.fullInput}
            />

            {/* Note Field */}
            <label style={{ ...styles.label, marginTop: "20px" }}>Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional"
              style={styles.fullInput}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.btn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Processing..." : "Send Money Now"}
            </button>
          </form>

          <p style={styles.footer}>Payments protected with secure validation 🔒</p>
        </div>
      </div>

      {/* SUCCESS POPUP RECEIPT */}
      {showPopup && receipt && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <div style={styles.success}>✓</div>
            <h2 style={{ textAlign: "center" }}>Payment Successful</h2>
            <p style={{ color: "#64748B", textAlign: "center" }}>Money has been sent successfully</p>
            <div style={styles.hr} />
            
            <div style={styles.row}><span>To</span><b>{receipt.name}</b></div>
            <div style={styles.row}><span>Mobile</span><b>{receipt.mobile}</b></div>
            <div style={styles.row}><span>Amount</span><b>₹{receipt.amount}</b></div>
            <div style={styles.row}><span>Note</span><b>{receipt.note}</b></div>
            <div style={styles.row}><span>Date</span><b>{receipt.date}</b></div>
            <div style={styles.row}><span>Txn ID</span><b style={{ fontSize: "10px" }}>{receipt.txn}</b></div>

            <button
              style={styles.popupBtn}
              onClick={() => {
                setShowPopup(false);
                navigate("/history");
              }}
            >
              View History
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// STYLES OBJECT (Kooda Replace Panniko da)
const styles = {
  page: { minHeight: "100vh", background: "#F8FAFC", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", fontFamily: "sans-serif" },
  card: { width: "100%", maxWidth: "450px", background: "white", borderRadius: "24px", padding: "30px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" },
  banner: { background: "linear-gradient(135deg,#4338CA,#06B6D4)", color: "white", padding: "20px", borderRadius: "20px", marginBottom: "25px" },
  small: { margin: 0, opacity: 0.8, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" },
  head: { margin: "5px 0 0 0", fontSize: "20px" },
  label: { display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "14px", color: "#374151" },
  inputBox: { border: "1px solid #E5E7EB", borderRadius: "12px", padding: "12px 15px", display: "flex", alignItems: "center", gap: "10px" },
  code: { color: "#4F46E5", fontWeight: "700" },
  input: { border: "none", outline: "none", flex: 1, fontSize: "16px" },
  tick: { color: "#10b981", fontWeight: "700" },
  fullInput: { width: "100%", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "12px 15px", fontSize: "16px", outline: "none", boxSizing: "border-box" },
  btn: { width: "100%", marginTop: "25px", padding: "15px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg,#4338CA,#06B6D4)", color: "white", fontWeight: "700", fontSize: "16px", transition: "0.3s" },
  footer: { textAlign: "center", marginTop: "20px", color: "#94A3B8", fontSize: "12px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px" },
  popup: { width: "100%", maxWidth: "380px", background: "white", borderRadius: "24px", padding: "25px" },
  success: { width: "60px", height: "60px", borderRadius: "50%", background: "#22C55E", color: "white", fontSize: "30px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 15px" },
  hr: { height: "1px", background: "#F1F5F9", margin: "15px 0" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" },
  popupBtn: { width: "100%", marginTop: "15px", padding: "14px", border: "none", borderRadius: "12px", background: "#4F46E5", color: "white", fontWeight: "600", cursor: "pointer" }
};

export default TransactionForm;