from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from decimal import Decimal
import requests, uuid, bcrypt, httpx
import traceback

from config import SUPABASE_URL, SUPABASE_KEY

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Headers ----------------
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

# ---------------- Table Names ----------------
USER_TABLE = "signup"
ACCOUNT_TABLE = "user_account"
WALLET_TABLE = "user_wallet"
TX_TABLE = "user_transaction"

# =====================================================
# HOME
# =====================================================


@app.get("/")
def home():
    return {"message": "Backend Working"}


# =====================================================
# SIGNUP
# =====================================================
@app.post("/signup")
async def signup(data: dict = Body(...)):
    try:

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not name or not email or not password:
            raise HTTPException(400, "All fields required")

        if len(password) < 6:
            raise HTTPException(400, "Password minimum 6 characters")

        async with httpx.AsyncClient(timeout=5) as client:

            # CHECK EMAIL
            check_url = (
                f"{SUPABASE_URL}/rest/v1/{USER_TABLE}" f"?email=eq.{email}&select=id"
            )

            check_res = await client.get(check_url, headers=headers)

            if len(check_res.json()) > 0:
                raise HTTPException(400, "Email already exists")

            # HASH PASSWORD
            hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

            # UUID
            user_id = str(uuid.uuid4())

            # IMPORTANT FIX
            payload = {
                "id": user_id,
                "name": name,
                "email": email,
                "password": hashed,
            }

            # INSERT USER
            res = await client.post(
                f"{SUPABASE_URL}/rest/v1/{USER_TABLE}", headers=headers, json=payload
            )

            print("SIGNUP:", res.text)

            if res.status_code not in [200, 201]:
                raise HTTPException(500, res.text)

            # =========================
            # CHECK WALLET EXISTS
            # =========================

            wallet_check_url = (
                f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}"
                f"?user_id=eq.{user_id}&select=id"
            )

            wallet_check = await client.get(wallet_check_url, headers=headers)

            wallet_data = wallet_check.json()
            print("WALLET CHECK:", wallet_data)

            # ========================
            # CREATE ONLY IF NOT EXISTS
            # =========================

            if len(wallet_data) == 0:
                wallet_payload = {"user_id": user_id, "balance": 0}

                wallet_res = await client.post(
                    f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}",
                    headers=headers,
                    json=wallet_payload,
                )

                print("WALLET CREATED:", wallet_res.text)

            else:

                print("WALLET ALREADY EXISTS")

        return {"success": True, "user_id": user_id}

    except Exception as e:

        print("SIGNUP ERROR:", str(e))

        raise HTTPException(500, str(e))


# =====================================================
# LOGIN
# =====================================================
@app.post("/login")
async def login(data: dict = Body(...)):
    try:

        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()

        if not email or not password:
            raise HTTPException(status_code=400, detail="Email and password required")

        async with httpx.AsyncClient(timeout=10) as client:

            # =========================
            # GET USER
            # =========================
            url = f"{SUPABASE_URL}/rest/v1/{USER_TABLE}" f"?email=eq.{email}&select=*"

            res = await client.get(url, headers=headers)

            if res.status_code != 200:
                raise HTTPException(status_code=500, detail="Database connection error")

            users = res.json()

            if len(users) == 0:
                raise HTTPException(status_code=400, detail="User not found")

            user = users[0]

            print("LOGIN USER:", user)

            # =========================
            # PASSWORD CHECK
            # =========================
            if not bcrypt.checkpw(
                password.encode("utf-8"), user["password"].encode("utf-8")
            ):
                raise HTTPException(status_code=400, detail="Wrong password")

            # IMPORTANT FIX
            user_id = user["id"]

            # =========================
            # CHECK ACCOUNT LINKED
            # =========================
            account_url = (
                f"{SUPABASE_URL}/rest/v1/{ACCOUNT_TABLE}"
                f"?user_id=eq.{user_id}&select=id"
            )

            account_res = await client.get(account_url, headers=headers)

            account_data = account_res.json()

            linked = len(account_data) > 0

            # =========================
            # SUCCESS RESPONSE
            # =========================
            return {
                "success": True,
                "message": "Login successful",
                "linked": linked,
                "user": {
                    "id": user["id"],
                    "name": user.get("name"),
                    "email": user.get("email"),
                },
            }

    except HTTPException as e:

        raise e

    except Exception as e:

        print("====== LOGIN ERROR ======")
        print(str(e))

        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# GET ACCOUNT DETAILS
# =====================================================
@app.get("/account-details/{user_id}")
async def get_account(user_id: str):
    try:
        # -------- DB CALL --------
        url = f"{SUPABASE_URL}/rest/v1/{ACCOUNT_TABLE}?user_id=eq.{user_id}&select=*"

        async with httpx.AsyncClient(timeout=5) as client:
            res = await client.get(url, headers=headers)

            if res.status_code != 200:
                raise HTTPException(status_code=500, detail="Database error")

            data = res.json()

        # -------- CHECK DATA --------
        if len(data) == 0:
            return {"linked": False}

        # -------- RESPONSE --------
        return {"linked": True, "data": data}

    except HTTPException as e:
        raise e

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# LINK ACCOUNT
# =====================================================


@app.post("/account-details")
async def save_account(data: dict = Body(...)):
    try:
        payload = {
            "id": data.get("user_id"),
            "name": data.get("name"),
            "mobile_number": data.get("mobile_number"),
            "account_number": data.get("account_number"),
            "ifsc_code": data.get("ifsc_code"),
            "user_id": data.get("user_id"),
        }

        url = f"{SUPABASE_URL}/rest/v1/{ACCOUNT_TABLE}"

        async with httpx.AsyncClient(timeout=5) as client:
            res = await client.post(url, headers=headers, json=payload)

            print("ACCOUNT INSERT:", res.status_code)
            print("ACCOUNT RESPONSE:", res.text)

            if res.status_code not in [200, 201]:
                raise HTTPException(500, res.text)

        return {"success": True}

    except Exception as e:
        raise HTTPException(500, str(e))


# =====================================================
# WALLET
# =====================================================
@app.get("/wallet/{user_id}")
async def get_wallet(user_id: str):
    try:
        url = f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}?user_id=eq.{user_id}&select=*"

        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(url, headers=headers)

            if res.status_code != 200:
                raise HTTPException(status_code=500, detail="Supabase Fetch Error")

            data = res.json()

        if not data:
            return {"success": True, "balance": 0.0}

        # Straightforward balance retrieval
        balance = data[0].get("balance", 0)
        return {"success": True, "balance": float(balance)}

    except Exception as e:
        print(f"Wallet Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# ===============================================
# SEND MONEY
# ===============================================


@app.post("/send-money")
async def send_money(data: dict = Body(...)):
    print("======== TRANSACTION START ========")
    try:
        # =========================
        # EXTRACT DATA
        # =========================
        tx_uuid = data.get("tx_uuid")
        sender_id = data.get("user_id")
        receiver_mobile = str(data.get("receiver_mobile", "")).replace(" ", "")
        amount = float(data.get("amount", 0))
        note = data.get("description", "No Note")

        print(
            f"TX ID: {tx_uuid} | SENDER: {sender_id} | RECEIVER: {receiver_mobile} | AMOUNT: {amount}"
        )

        # =========================
        # VALIDATION (Blocks 0, Negatives, and Missing Fields)
        # =========================
        if not tx_uuid:
            raise HTTPException(status_code=400, detail="Transaction ID missing")
        if not sender_id:
            raise HTTPException(status_code=400, detail="Sender ID missing")
        if not receiver_mobile:
            raise HTTPException(status_code=400, detail="Receiver mobile missing")
        if amount <= 0:
            raise HTTPException(
                status_code=400, detail="Invalid amount. Must be greater than 0."
            )

        async with httpx.AsyncClient(timeout=15) as client:
            # =========================
            # IDEMPOTENCY CHECK
            # =========================
            check_url = (
                f"{SUPABASE_URL}/rest/v1/user_transaction?id=eq.{tx_uuid}&select=id"
            )
            check_res = await client.get(check_url, headers=headers)
            if len(check_res.json()) > 0:
                return {"success": True, "message": "Already processed"}

            # =========================
            # GET RECEIVER
            # =========================
            rx_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/user_account?mobile_number=eq.{receiver_mobile}&select=user_id,name",
                headers=headers,
            )
            rx_data = rx_res.json()
            if not rx_data:
                raise HTTPException(status_code=404, detail="Receiver not found")

            receiver_id = rx_data[0]["user_id"]
            receiver_name = rx_data[0]["name"]

            # =========================
            # BLOCK SELF TRANSFER
            # =========================
            if sender_id == receiver_id:
                raise HTTPException(
                    status_code=400, detail="Cannot send money to yourself"
                )

            # =========================
            # GET WALLETS (Fetch balance data first)
            # =========================
            sender_wallet_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{sender_id}&select=*",
                headers=headers,
            )
            sender_wallet_data = sender_wallet_res.json()
            if not sender_wallet_data:
                raise HTTPException(status_code=404, detail="Sender wallet not found")

            receiver_wallet_res = await client.get(
                f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{receiver_id}&select=*",
                headers=headers,
            )
            receiver_wallet_data = receiver_wallet_res.json()
            if not receiver_wallet_data:
                raise HTTPException(status_code=404, detail="Receiver wallet not found")

            # =========================
            # PARSE BALANCES & SAFETY CHECKS
            # =========================
            sender_balance = max(0.0, float(sender_wallet_data[0]["balance"]))
            receiver_balance = max(0.0, float(receiver_wallet_data[0]["balance"]))

            print(
                f"SENDER WALLET BALANCE: {sender_balance} | RECEIVER WALLET BALANCE: {receiver_balance}"
            )

            # =========================
            # BALANCE VALIDATION
            # =========================
            if sender_balance == 0 or amount > sender_balance:
                raise HTTPException(status_code=400, detail=sender_balance)

            # =========================
            # CALCULATE NEW BALANCES
            # =========================
            new_sender_balance = round(sender_balance - amount, 2)
            new_receiver_balance = round(receiver_balance + amount, 2)

            if new_sender_balance < 0:
                raise HTTPException(status_code=400, detail=new_sender_balance)

            # =========================
            # UPDATE SENDER WALLET
            # =========================
            sender_update = await client.patch(
                f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{sender_id}",
                headers=headers,
                json={"balance": new_sender_balance},
            )

            # =========================
            # UPDATE RECEIVER WALLET
            # =========================
            await client.patch(
                f"{SUPABASE_URL}/rest/v1/user_wallet?user_id=eq.{receiver_id}",
                headers=headers,
                json={"balance": new_receiver_balance},
            )

            # =========================
            # SAVE HISTORY
            # =========================
            history_entry = {
                "id": tx_uuid,
                "user_id": sender_id,
                "receiver_id": receiver_id,
                "receiver_name": receiver_name,
                "receiver_mobile": receiver_mobile,
                "amount": amount,
                "type": "debit",
                "description": note,
                "created_at": datetime.utcnow().isoformat(),
            }

            save_res = await client.post(
                f"{SUPABASE_URL}/rest/v1/user_transaction",
                headers=headers,
                json=history_entry,
            )

            if save_res.status_code not in [200, 201]:
                print("DB SAVE ERROR:", save_res.text)
                raise HTTPException(status_code=500, detail="Insuffiecient Balance")

            print("======== SUCCESS ========")
            return {
                "success": True,
                "message": "Transaction successful",
                "balance": new_sender_balance,
            }

    except HTTPException as e:
        print("HTTP ERROR:", e.detail)
        raise e
    except Exception as e:
        print("SERVER ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


# ADD MONEY
@app.post("/add-money")
async def add_money(data: dict = Body(...)):

    try:

        print("========== ADD MONEY ==========")

        user_id = data.get("user_id")
        amount = float(data.get("amount", 0))

        print("USER ID:", user_id)
        print("AMOUNT:", amount)

        # =========================
        # VALIDATION
        # =========================

        if not user_id:
            raise HTTPException(status_code=400, detail="User ID missing")

        if amount <= 0:
            raise HTTPException(status_code=400, detail="Invalid amount")

        async with httpx.AsyncClient(timeout=15) as client:

            # =========================
            # GET WALLET
            # =========================

            wallet_url = (
                f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}"
                f"?user_id=eq.{user_id}&select=*"
            )

            wallet_res = await client.get(wallet_url, headers=headers)

            print("WALLET STATUS:", wallet_res.status_code)
            print("WALLET RESPONSE:", wallet_res.text)

            if wallet_res.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to fetch wallet")

            wallet = wallet_res.json()

            # =========================
            # CREATE WALLET IF NOT EXISTS
            # =========================

            if len(wallet) == 0:

                create_payload = {"user_id": user_id, "balance": 0}

                create_res = await client.post(
                    f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}",
                    headers={**headers, "Prefer": "return=representation"},
                    json=create_payload,
                )

                print("CREATE STATUS:", create_res.status_code)
                print("CREATE RESPONSE:", create_res.text)

                if create_res.status_code not in [200, 201]:
                    raise HTTPException(
                        status_code=500, detail="Wallet creation failed"
                    )

                wallet = create_res.json()

            # =========================
            # CURRENT BALANCE
            # =========================

            current_balance = float(wallet[0]["balance"])

            print("CURRENT BALANCE:", current_balance)

            # =========================
            # NEW BALANCE
            # =========================

            new_balance = round(current_balance + amount, 2)

            print("NEW BALANCE:", new_balance)

            # =========================
            # UPDATE WALLET
            # =========================

            update_res = await client.patch(
                f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}?user_id=eq.{user_id}",
                headers={**headers, "Prefer": "return=representation"},
                json={"balance": new_balance},
            )

            print("UPDATE STATUS:", update_res.status_code)
            print("UPDATE RESPONSE:", update_res.text)

            if update_res.status_code not in [200, 204]:
                raise HTTPException(status_code=500, detail="Wallet update failed")

            # =========================
            # SAVE TRANSACTION
            # =========================

            tx_payload = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "receiver_id": user_id,
                "receiver_name": "Wallet Topup",
                "receiver_mobile": "",
                "amount": amount,
                "type": "credit",
                "description": "Money Added",
                "created_at": datetime.utcnow().isoformat(),
            }

            tx_res = await client.post(
                f"{SUPABASE_URL}/rest/v1/{TX_TABLE}", headers=headers, json=tx_payload
            )

            print("TX STATUS:", tx_res.status_code)
            print("TX RESPONSE:", tx_res.text)

        return {"success": True, "balance": new_balance}

    except HTTPException as e:
        raise e

    except Exception as e:

        print("ADD MONEY ERROR:", str(e))

        raise HTTPException(status_code=500, detail=str(e))


# =====================================================
# TRANSACTION HISTORY
# =====================================================


@app.get("/transactions/{user_id}")
async def get_transactions(user_id: str):

    TX_TABLE_FIXED = "user_transaction"

    print(f"DEBUG: Fetching for User ID -> {user_id}")

    try:

        url = f"{SUPABASE_URL}/rest/v1/{TX_TABLE_FIXED}?select=*"

        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.get(url, headers=headers)

            if res.status_code != 200:
                print(f"DB Error: {res.text}")
                return {"success": False, "transactions": []}

            all_data = res.json()
            print(f"DEBUG: Total rows in DB: {len(all_data)}")

        # Step B: Manual Filtering
        cleaned = []
        for item in all_data:

            db_user_id = str(item.get("user_id", "")).strip()
            req_user_id = str(user_id).strip()

            if db_user_id == req_user_id:
                cleaned.append(
                    {
                        "id": item.get("id"),
                        "amount": float(item.get("amount", 0)),
                        "type": item.get("type", ""),
                        "receiver_name": item.get("receiver_name") or "Transaction",
                        "receiver_mobile": item.get("receiver_mobile", ""),
                        "description": item.get("descriptior")
                        or "",  # 'descriptior' as per screenshot
                        "created_at": item.get("created_at"),
                    }
                )

        print(f"DEBUG: Matched rows for {user_id} -> {len(cleaned)}")

        # Sort by date
        cleaned.sort(
            key=lambda x: x["created_at"] if x["created_at"] else "", reverse=True
        )

        return {"success": True, "transactions": cleaned}

    except Exception as e:
        print(f"CRASH ERROR: {str(e)}")
        return {"success": False, "transactions": [], "detail": str(e)}


@app.get("/user-by-mobile/{mobile}")
async def get_user_by_mobile(mobile: str):

    try:
        url = f"{SUPABASE_URL}/rest/v1/{ACCOUNT_TABLE}?mobile_number=eq.{mobile}&select=name"

        async with httpx.AsyncClient(timeout=5) as client:
            res = await client.get(url, headers=headers)

        data = res.json()

        if len(data) == 0:
            raise HTTPException(404, "User not found")

        return {"success": True, "name": data[0]["name"]}

    except Exception as e:
        raise HTTPException(500, str(e))


# =====================================================
# HEALTH SCORE
# =====================================================


@app.get("/health-score/{user_id}")
async def health_score(user_id: str):

    try:

        # =========================
        # GET WALLET
        # =========================
        wallet_url = (
            f"{SUPABASE_URL}/rest/v1/{WALLET_TABLE}" f"?user_id=eq.{user_id}&select=*"
        )

        # =========================
        # GET TRANSACTIONS
        # =========================
        tx_url = f"{SUPABASE_URL}/rest/v1/{TX_TABLE}" f"?user_id=eq.{user_id}&select=*"

        async with httpx.AsyncClient(timeout=10) as client:

            wallet_res = await client.get(wallet_url, headers=headers)

            tx_res = await client.get(tx_url, headers=headers)

            wallet_data = wallet_res.json()
            tx_data = tx_res.json()

        # =========================
        # BALANCE
        # =========================
        balance = 0

        if len(wallet_data) > 0:
            balance = float(wallet_data[0]["balance"])

        # =========================
        # CALCULATE CREDIT / DEBIT
        # =========================
        total_credit = 0
        total_debit = 0

        for item in tx_data:

            amount = float(item.get("amount", 0))

            if item.get("type") == "credit":
                total_credit += amount

            elif item.get("type") == "debit":
                total_debit += amount

        # =========================
        # TRANSACTION COUNT
        # =========================
        transaction_count = len(tx_data)

        # =========================
        # HEALTH SCORE LOGIC
        # =========================
        score = 50

        if balance > 1000:
            score += 10

        if balance > 5000:
            score += 10

        if total_credit > total_debit:
            score += 15

        if transaction_count >= 5:
            score += 10

        if transaction_count >= 10:
            score += 5

        if score > 100:
            score = 100

        # =========================
        # RESPONSE
        # =========================
        return {
            "success": True,
            "fin_health_score": score,
            "balance": balance,
            "total_credit": total_credit,
            "total_debit": total_debit,
            "transaction_count": transaction_count,
        }

    except Exception as e:

        print("HEALTH SCORE ERROR:", str(e))

        raise HTTPException(status_code=500, detail=str(e))
