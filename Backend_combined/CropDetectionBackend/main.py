from fastapi import FastAPI, File, UploadFile, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from PIL import Image
import numpy as np
import onnxruntime as rt
import io
import os
from datetime import datetime
from disease_info import disease_data  # Static disease info
from mongo import detections_collection  # MongoDB connection
from bson import ObjectId
import uuid

app = FastAPI()

# CORS (for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Class names as per ONNX model
class_names = {
    0: "Blight",
    1: "Common_Rust",
    2: "Gray_Leaf_Spot",
    3: "Healthy",
    4: "MLN",
    5: "FAW",
    6: "Maize_Streak"
}

# Load ONNX model
IMG_SIZE = (224, 224)
model_path = "model/model.onnx"
sess = rt.InferenceSession(model_path)
input_name = sess.get_inputs()[0].name

# Create uploads directory if it doesn't exist
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Preprocess image
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array.astype(np.float32)

# Enhanced function to save uploaded image
def save_uploaded_image(image_bytes, filename):
    """Save uploaded image to local filesystem and return the path"""
    try:
        print(f"💾 Saving image: {filename}")  # Debug log
        
        # Generate unique filename to avoid conflicts
        file_extension = filename.split('.')[-1] if '.' in filename else 'jpg'
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        print(f"💾 Generated unique filename: {unique_filename}")  # Debug log
        print(f"💾 Full file path: {file_path}")  # Debug log
        
        # Ensure upload directory exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Save the image
        with open(file_path, 'wb') as f:
            f.write(image_bytes)
        
        # Verify the file was saved
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"✅ Image saved successfully: {file_path} ({file_size} bytes)")
            return file_path
        else:
            print(f"❌ Failed to save image: {file_path}")
            return None
            
    except Exception as e:
        print(f"❌ Error saving image: {str(e)}")
        return None

#  Enhanced POST /predict
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        print(f"🔍 Processing prediction for file: {file.filename}")  # Debug log
        
        image_bytes = await file.read()
        print(f"🔍 File size: {len(image_bytes)} bytes")  # Debug log
        
        #  Save uploaded image to filesystem
        image_path = save_uploaded_image(image_bytes, file.filename)
        if not image_path:
            return {"error": "Failed to save uploaded image"}
        
        # Extract just the filename for the database (without the full path)
        filename_only = os.path.basename(image_path)
        print(f"🔍 Stored filename: {filename_only}")  # Debug log
        
        input_image = preprocess_image(image_bytes)

        predictions = sess.run(None, {input_name: input_image})
        predicted_index = int(np.argmax(predictions[0], axis=1)[0])
        confidence = float(np.max(predictions[0]))

        raw_class_name = class_names.get(predicted_index, "Unknown")
        predicted_class = raw_class_name.replace("_", " ").title()

        disease_info = disease_data.get(predicted_class)

        if not disease_info:
            return {
                "predicted_class": predicted_class,
                "confidence": round(confidence, 2),
                "error": "No disease info available."
            }

        #  Store in DB with both full path and filename
        detection_record = {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2),
            "category": disease_info["category"],
            "part_scanned": disease_info["part_scanned"],
            "symptoms": disease_info["symptoms"],
            "treatment": disease_info["treatment"],
            "prevention": disease_info["prevention"],
            "image_path": image_path,  # Full path for backend use
            "image_filename": filename_only,  # Just filename for frontend use
            "original_filename": file.filename,  # Original uploaded filename
            "timestamp": datetime.utcnow()
        }

        result = detections_collection.insert_one(detection_record)
        detection_record["_id"] = str(result.inserted_id)

        print("✅ Prediction successful:", detection_record)
        return detection_record

    except Exception as e:
        print("❌ Error during prediction:", str(e))
        return {"error": str(e)}

# GET /history
@app.get("/history")
def get_all_history():
    try:
        reports = list(detections_collection.find().sort("timestamp", -1))
        for report in reports:
            report["_id"] = str(report["_id"])
        print(f"📋 Retrieved {len(reports)} history records")
        return reports
    except Exception as e:
        print(f"❌ Error fetching history: {str(e)}")
        return {"error": str(e)}

# GET /report/{id}
@app.get("/report/{report_id}")
def get_report(report_id: str):
    try:
        report = detections_collection.find_one({"_id": ObjectId(report_id)})
        if not report:
            return {"error": "Report not found"}
        report["_id"] = str(report["_id"])
        print(f"📄 Retrieved report: {report_id}")
        return report
    except Exception as e:
        print(f"❌ Error fetching report {report_id}: {str(e)}")
        return {"error": str(e)}

# DELETE /report/{id}
@app.delete("/report/{report_id}")
def delete_report(report_id: str):
    try:
        #  Get report first to delete associated image
        report = detections_collection.find_one({"_id": ObjectId(report_id)})
        if report and "image_path" in report:
            # Delete the image file if it exists
            if os.path.exists(report["image_path"]):
                os.remove(report["image_path"])
                print(f"🗑️ Deleted image: {report['image_path']}")
        
        # Delete from database
        result = detections_collection.delete_one({"_id": ObjectId(report_id)})
        print(f"🗑️ Deleted report: {report_id}")
        return {"deleted": result.deleted_count == 1}
    except Exception as e:
        print(f"❌ Error deleting report {report_id}: {str(e)}")
        return {"error": str(e)}

# PUT /report/{id} to edit/update
@app.put("/report/{report_id}")
def update_report(report_id: str, updated_data: dict = Body(...)):
    try:
        result = detections_collection.update_one(
            {"_id": ObjectId(report_id)},
            {"$set": updated_data}
        )
        if result.modified_count == 1:
            print(f"✏️ Updated report: {report_id}")
            return {"message": "Report updated successfully"}
        return {"error": "Update failed or no changes made"}
    except Exception as e:
        print(f"❌ Error updating report {report_id}: {str(e)}")
        return {"error": str(e)}

#  Enhanced image serving endpoint
@app.get("/image/{filename}")
def get_image(filename: str):
    try:
        print(f"🔍 Requesting image: {filename}")  # Debug log
        
        # Security check - prevent directory traversal
        if ".." in filename or "/" in filename or "\\" in filename:
            print(f"❌ Security violation: Invalid filename {filename}")
            raise HTTPException(status_code=400, detail="Invalid filename")
        
        file_path = os.path.join(UPLOAD_DIR, filename)
        print(f"🔍 Looking for file at: {file_path}")  # Debug log
        
        if os.path.exists(file_path):
            print(f"✅ File found: {file_path}")  # Debug log
            
            # Determine media type based on file extension
            file_extension = filename.split('.')[-1].lower()
            media_type_map = {
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'gif': 'image/gif',
                'webp': 'image/webp',
                'bmp': 'image/bmp'
            }
            media_type = media_type_map.get(file_extension, 'image/jpeg')
            
            return FileResponse(
                file_path,
                media_type=media_type,
                headers={
                    "Cache-Control": "public, max-age=3600",
                    "Access-Control-Allow-Origin": "*"  # Allow CORS for images
                }
            )
        else:
            print(f"❌ File not found: {file_path}")  # Debug log
            
            # List files in upload directory for debugging
            if os.path.exists(UPLOAD_DIR):
                files = os.listdir(UPLOAD_DIR)
                print(f"📁 Files in upload directory: {files}")
            else:
                print(f"📁 Upload directory doesn't exist: {UPLOAD_DIR}")
            
            raise HTTPException(status_code=404, detail="Image not found")
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error serving image {filename}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

#  Debug endpoint to list all uploaded images
@app.get("/debug/images")
def list_uploaded_images():
    """Debug endpoint to list all uploaded images"""
    try:
        if not os.path.exists(UPLOAD_DIR):
            return {"error": "Upload directory doesn't exist", "upload_dir": UPLOAD_DIR}
        
        files = os.listdir(UPLOAD_DIR)
        file_info = []
        
        for filename in files:
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                file_info.append({
                    "filename": filename,
                    "size": os.path.getsize(file_path),
                    #"url": f"http://localhost:8000/image/{filename}"
                    "url": f"/image/{filename}"
                })
        
        return {
            "upload_dir": UPLOAD_DIR,
            "total_files": len(file_info),
            "files": file_info
        }
    except Exception as e:
        return {"error": str(e)}

#  Health check endpoint
@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "upload_dir": UPLOAD_DIR,
        "upload_dir_exists": os.path.exists(UPLOAD_DIR)
    }

#  Root endpoint
@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "message": "Crop Disease Detection API",
        "version": "1.0.0",
        "endpoints": {
            "predict": "/predict",
            "history": "/history",
            "report": "/report/{id}",
            "image": "/image/{filename}",
            "debug": "/debug/images",
            "health": "/health"
        }
    }