import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_ANON_KEY") or ""
is_production = os.environ.get("VERCEL") == "1"

if not url or not key:
    if is_production:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_KEY (or SUPABASE_ANON_KEY) must be set in production."
        )
    # Local dev: allow placeholder so app starts; API calls will fail until env is set
    supabase: Client = create_client("https://placeholder.supabase.co", "placeholder")
else:
    supabase: Client = create_client(url, key)
