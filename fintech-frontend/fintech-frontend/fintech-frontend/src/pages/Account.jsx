import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Pages/LogoutButton";

function Account() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [account, setAccount] = useState("");
  const [ifsc, setIfsc] = useState("");

  const userId = localStorage.getItem("user_id");

  const handleSubmit = async (e) => {
    e.preventDefault(); // important

    try {
      const res = await fetch("http://127.0.0.1:8000/account-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          name,
          mobile_number: mobile,
          account_number: account,
          ifsc_code: ifsc
        })
      });

      const data = await res.json();

      if (data.success) {
        navigate("/wallet");
      } else {
        alert(data.detail || "Failed");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="card">
      <h2>Account Details</h2>

      <form onSubmit={handleSubmit}>
        <input className="input" placeholder="Name"
          onChange={(e) => setName(e.target.value)} />

        <input className="input" placeholder="Mobile Number"
          onChange={(e) => setMobile(e.target.value)} />

        <input className="input" placeholder="Account Number"
          onChange={(e) => setAccount(e.target.value)} />

        <input className="input" placeholder="IFSC Code"
          onChange={(e) => setIfsc(e.target.value)} />

        <button type="submit" className="btn">
          Submit
        </button>

        <div style={{ marginTop: "15px" }}>
          <LogoutButton />
        </div>

      </form>
    </div>
  );
}

export default Account;