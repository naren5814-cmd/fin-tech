function Toast({
  show,
  type,
  message,
  onClose,
}) {
  if (!show) return null;

  const bg =
    type === "success"
      ? "#16A34A"
      : type === "error"
      ? "#DC2626"
      : "#4F46E5";

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      background: "white",
      minWidth: "320px",
      padding: "14px 18px",
      borderRadius: "14px",
      boxShadow:
        "0 10px 25px rgba(0,0,0,0.12)",
      borderLeft: `5px solid ${bg}`,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontFamily: "Arial"
    }}>
      <div style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        background: bg
      }} />

      <div style={{
        flex: 1,
        fontWeight: "600"
      }}>
        {message}
      </div>

      <button
        onClick={onClose}
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          fontSize: "18px"
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;