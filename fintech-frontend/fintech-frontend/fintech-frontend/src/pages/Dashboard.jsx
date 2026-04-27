import WalletCard from "./WalletCard";
import TransactionForm from "./TransactionForm";
import TransactionHistory from "./TransactionHistory";

function Dashboard() {
  return (
    <>
      <div className="dashboard-wallet">
        <WalletCard />
      </div>

      <div className="dashboard-grid">
        <div className="equal-card">
          <TransactionForm />
        </div>

        <div className="equal-card">
          <TransactionHistory />
        </div>
      </div>
    </>
  );
}

export default Dashboard;