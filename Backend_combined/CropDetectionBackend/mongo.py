from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")  # Replace with your Mongo URI
db = client["agriiq"]  # Your existing DB
detections_collection = db["detections"]  # New collection for results
