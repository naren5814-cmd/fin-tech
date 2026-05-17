import {
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FloatingHealthButton from "./components/HealthScoreFloat";
import {ToastProvider} from "./context/ToastContext"
import Home from "./pages/Home";
import WalletCard from "./pages/WalletCard";
import TransactionForm from "./pages/TransactionForm";
import TransactionHistory from "./pages/TransactionHistory";
import Account from "./pages/Account";
import AddMoney from "./pages/AddMoney";
import HealthScore from "./pages/HealthScore";
import AccountLink from "./pages/Account-link";

function App() {
  return (
    <>

      <ToastProvider>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route 
          path="/signup"
          element={<Signup />}
        />
        
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/wallet"
          element={<WalletCard />}
        />

        <Route
          path="/transaction"
          element={
            <TransactionForm />
          }
        />

        <Route
          path="/history"
          element={
            <TransactionHistory />
          }
        />

        <Route 
          path="/account-details"
          element={<Account/>}/>

        <Route
          path="/account-link"
          element={<AccountLink />}
        />

        <Route
          path="/add-money"
          element={
            <AddMoney />
          }
        />

        <Route
          path="/health-score"
          element={
            <HealthScore />
          }

        />

        
      </Routes>

      <FloatingHealthButton />
      </ToastProvider>
    </>
  );
}

export default App;