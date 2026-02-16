# from pymongo import MongoClient

# client = MongoClient("mongodb://localhost:27017")  # Replace with your Mongo URI
# db = client["agriiq"]  # Your existing DB
# detections_collection = db["detections"]  # New collection for results
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise Exception("MONGO_URL environment variable not set")

client = MongoClient(MONGO_URL)

db = client["agriiq"]
detections_collection = db["detections"]
