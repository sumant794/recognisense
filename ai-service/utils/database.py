from pymongo import MongoClient
from pymongo.database import Database 
from config.settings import settings 

# Global variable — ek baar connect karo
client: MongoClient = None
db: Database = None

def connect_db():
    global client, db

    try:
        client = MongoClient(settings.MONGODB_URI)

        # Connection Test Karo
        client.admin.command('ping')

        # Same database jo bakcend use karta hai 
        db = client['recognisense']

        print("✅ MongoDB Connected (AI Service)")
        return db
    
    except Exception as e: 
        print(f"❌ MongoDB connection failed: {e}")
        raise e
    
def get_db() -> Database: 
    global db
    if db is None:
        connect_db()
    return db