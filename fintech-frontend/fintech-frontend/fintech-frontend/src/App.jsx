import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import WalletCard from "./pages/WalletCard";
import TransactionForm from "./pages/TransactionForm";
import TransactionHistory from "./pages/TransactionHistory";
import Account from "./pages/Account";
import AddMoney from "./pages/AddMoney";

function App() {
  return (
    <>
      <Navbar />

      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/wallet" element={<WalletCard />} />
          <Route path="/transaction" element={<TransactionForm />} />
          <Route path="/history" element={<TransactionHistory />} />
          <Route path="/account" element={<Account />} />
          <Route path="/add-money" element={<AddMoney />} />
        </Routes>
      </div>
    </>
  );
}

export default App;