import os
from pymongo import MongoClient

DATABASE_URI = os.getenv("DATABASE_URI")
DB_NAME = os.getenv("DB_NAME", "voltorchestra_db")

if not DATABASE_URI:
    raise ValueError("DATABASE_URI environment variable is not set in .env")

# Initialize the shared MongoClient
client = MongoClient(DATABASE_URI)
db = client[DB_NAME]
