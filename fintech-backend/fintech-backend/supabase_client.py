import requests

SUPABASE_URL = "https://joesdhpovssgbtpgwqik.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZXNkaHBvdnNzZ2J0cGd3cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5MjAzNzYsImV4cCI6MjA5MjQ5NjM3Nn0.5n1aZTCruvs5KCMu_e2kPvyZaiTYj_IBvUm2tazU5M4"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}