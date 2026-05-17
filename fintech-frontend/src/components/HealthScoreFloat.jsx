
import { useNavigate } from "react-router-dom";

function FloatingHealthButton() {
  const navigate =
    useNavigate();

  return (
    <button
      style={styles.btn}
      onClick={() =>
        navigate(
          "/health-score"
        )
      }
    >
      💚
    </button>
  );
}

const styles = {
  btn: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "28px",
    color: "white",
    background:
      "linear-gradient(135deg,#22C55E,#06B6D4)",
    boxShadow:
      "0 12px 25px rgba(0,0,0,0.18)",
    zIndex: 999,
    animation:
      "pulse 1.5s infinite",
  },
};

export default FloatingHealthButton;