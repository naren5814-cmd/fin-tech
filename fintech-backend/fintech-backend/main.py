from fastapi import FastAPI, Body, HTTPException
import requests
from fastapi.middleware.cors import CORSMiddleware
from config import SUPABASE_URL, SUPABASE_KEY

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

@app.get("/")
def home():
    return {"message": "Backend Working"}

# Get Wallet Balance
@app.get("/wallet/{user_id}")
def get_wallet(user_id: str):
    url = f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{user_id}&select=*"
    res = requests.get(url, headers=headers)
    data = res.json()

    if not data:
        raise HTTPException(status_code=404, detail="Wallet not found")

    return {
        "user_id": user_id,
        "balance": data[0]["balance"]
    }


# Add Transaction
@app.post("/user_transaction")
def add_transaction(data: dict = Body(...)):

    user_id = data["user_id"]
    amount = data["amount"]
    t_type = data["type"].lower()

    # Amount validation
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    # Type validation
    if t_type not in ["credit", "debit"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    # Check wallet
    wallet_url = f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{user_id}&select=*"
    wallet_res = requests.get(wallet_url, headers=headers).json()

    if not wallet_res:
        raise HTTPException(status_code=404, detail="Wallet not found")

    balance = wallet_res[0]["balance"]

    # Debit validation
    if t_type == "debit" and amount > balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Insert transaction
    url = f"{SUPABASE_URL}/rest/v1/user_transaction"

    payload = {
        "user_id": user_id,
        "type": t_type,
        "amount": amount,
        "description": data.get("description", "")
    }

    res = requests.post(url, headers=headers, json=payload)

    return {
        "success": True,
        "message": "Transaction added successfully",
        "data": res.json()
    }


# Get Transaction History
@app.get("/user_transaction/{user_id}")
def get_transactions(user_id: str):
    url = f"{SUPABASE_URL}/rest/v1/user_transaction?user_id=eq.{user_id}&select=*&order=id.desc&limit=10"
    res = requests.get(url, headers=headers)
    return {
        "user_id": user_id,
        "transactions": res.json()
    }

@app.post("/send-money")
def send_money(data: dict = Body(...)):

    sender_id = str(data["sender_id"])
    receiver_mobile = data["receiver_mobile"]
    amount = float(data["amount"])

    if not receiver_mobile:
        raise HTTPException(status_code=400, detail="Enter mobile number")

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    # Find receiver
    user_url = f"{SUPABASE_URL}/rest/v1/user_signup?mobile_number=eq.{receiver_mobile}&select=id,name"
    user_res = requests.get(user_url, headers=headers).json()

    if not user_res:
        raise HTTPException(status_code=404, detail="Receiver not found")

    receiver_id = str(user_res[0]["id"])
    receiver_name = user_res[0]["name"]

    # Self transfer block
    if sender_id == receiver_id:
        raise HTTPException(status_code=400, detail="Cannot send to yourself")

    # Sender wallet
    sender_url = f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{sender_id}&select=*"
    sender_wallet = requests.get(sender_url, headers=headers).json()

    if not sender_wallet:
        raise HTTPException(status_code=404, detail="Sender wallet not found")

    sender_balance = float(sender_wallet[0]["balance"])

    if amount > sender_balance:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    # Receiver wallet
    receiver_url = f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{receiver_id}&select=*"
    receiver_wallet = requests.get(receiver_url, headers=headers).json()

    if not receiver_wallet:
        raise HTTPException(status_code=404, detail="Receiver wallet not found")

    receiver_balance = float(receiver_wallet[0]["balance"])

    # Update sender balance
    new_sender = sender_balance - amount

    requests.patch(
        f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{sender_id}",
        headers=headers,
        json={"balance": new_sender}
    )

    # Update receiver balance
    new_receiver = receiver_balance + amount

    requests.patch(
        f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{receiver_id}",
        headers=headers,
        json={"balance": new_receiver}
    )

    # Insert sender history
    tx_url = f"{SUPABASE_URL}/rest/v1/user_transaction"

    requests.post(tx_url, headers=headers, json={
        "user_id": sender_id,
        "receiver_id": receiver_id,
        "receiver_name": receiver_name,
        "type": "debit",
        "amount": amount,
        "description": "Money Sent"
    })

    # Insert receiver history
    requests.post(tx_url, headers=headers, json={
        "user_id": receiver_id,
        "receiver_id": sender_id,
        "type": "credit",
        "amount": amount,
        "description": "Money Received"
    })

    return {
        "success": True,
        "message": f"₹{amount} sent to {receiver_name}"
    }

@app.post("/account-details")
def save_account(data: dict = Body(...)):

    user_id = data["user_id"]
    name = data["name"]
    mobile = data["mobile_number"]
    account = data["account_number"]
    ifsc = data["ifsc_code"]

    # duplicate account check
    check_url = f"{SUPABASE_URL}/rest/v1/user_signup?account_number=eq.{account}&select=id"
    check_res = requests.get(check_url, headers=headers).json()

    if check_res and check_res[0]["id"] != user_id:
        raise HTTPException(status_code=400, detail="Account already exist")

    url = f"{SUPABASE_URL}/rest/v1/user_signup?id=eq.{user_id}"

    payload = {
        "name": name,
        "mobile_number": mobile,
        "account_number": account,
        "ifsc_code": ifsc
    }

    requests.patch(url, headers=headers, json=payload)

    return {
        "success": True,
        "message": "Account details saved"
    }

# ==============================
# ADD THIS IN main.py (FastAPI)
# Dashboard API
# ==============================

@app.get("/dashboard/{user_id}")
def dashboard(user_id: str):

    # Wallet Balance
    wallet_url = f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{user_id}&select=*"
    wallet_res = requests.get(wallet_url, headers=headers).json()

    balance = 0
    if wallet_res:
        balance = wallet_res[0]["balance"]

    # Transactions
    tx_url = f"{SUPABASE_URL}/rest/v1/user_transaction?user_id=eq.{user_id}&select=*"
    tx_res = requests.get(tx_url, headers=headers).json()

    total_credit = 0
    total_debit = 0

    for item in tx_res:
        if item["type"] == "credit":
            total_credit += item["amount"]
        elif item["type"] == "debit":
            total_debit += item["amount"]

    recent = tx_res[-5:][::-1]

    return {
        "success": True,
        "balance": balance,
        "total_credit": total_credit,
        "total_debit": total_debit,
        "transaction_count": len(tx_res),
        "recent_transactions": recent
    }