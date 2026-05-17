import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login data
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    // Optional full clear
    // localStorage.clear();

    alert("Logged out successfully");

    // Redirect login page
    navigate("/login");
  };

  return (
    <button
      className="btn"
      onClick={handleLogout}
      style={{
        background: "#EF4444",
        color: "white",
      }}
    >
      Logout
    </button>
  );
}

export default LogoutButton;