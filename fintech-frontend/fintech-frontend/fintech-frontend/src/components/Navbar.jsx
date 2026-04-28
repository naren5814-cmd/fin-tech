import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">FinTech</h2>

      <div className="nav-links">
        <Link to="/Home">Home</Link>
        <Link to="/Dashboard">Dashboard</Link>
        <Link to="/wallet">Wallet</Link>
        <Link to="/transaction">Transaction</Link>
        <Link to="/history">History</Link>
        <Link to="/account">Account</Link>
      </div>
    </nav>
  );
}

export default Navbar;