import cloudinary
import cloudinary.api
import json
import subprocess
from datetime import datetime

# Configure Cloudinary
cloudinary.config( 
  cloud_name = "dnzjznp7t",  
  api_key = "189492633413167",  
  api_secret = "eNbSDf3K50lviNt1s83xUGcdQkQ"  
)

JSON_FILE = "houseboats.json"

def fetch_images_from_cloudinary():
    """Fetch all images and convert to list of houseboat objects"""
    result = cloudinary.api.resources(type="upload", max_results=500, prefix="Houseboats/")

    houseboats = []
    boat_counter = 1

    for item in result["resources"]:
        url = item["secure_url"]
        public_id = item["public_id"]

        # Example: Houseboats/Deluxe/1bed/1/img1.jpg
        parts = public_id.split("/")
        if len(parts) < 4:
            continue  

        category = parts[1]   # Deluxe / Premium / Luxury
        bed_type = parts[2]   # 1bed / 2bed
        boat_no = parts[3]    # 1 / 2 / 3
        filename = parts[-1]

        # Check if boat already exists
        existing_boat = next((b for b in houseboats if b["id"] == boat_counter), None)
        if not existing_boat:
            houseboats.append({
                "id": boat_counter,
                "name": f"{category} {bed_type} - Boat {boat_no}",
                "type": category,
                "bedroom": bed_type.replace("bed", ""),
                "price": "₹10,000 onwards",  # optional default, can customize
                "rating": 4.5,              # optional default
                "mainImage": url,
                "thumbnails": [url]
            })
            boat_counter += 1
        else:
            existing_boat["thumbnails"].append(url)

    return houseboats

def update_json():
    """Fetch Cloudinary images and update JSON file"""
    data = fetch_images_from_cloudinary()

    with open(JSON_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    print(f"✅ JSON updated successfully on {datetime.now()} and saved to {JSON_FILE}")

def git_push():
    """Auto pull + commit + push changes to GitHub"""
    try:
        subprocess.run(["git", "pull", "--rebase"], check=True)
        subprocess.run(["git", "add", JSON_FILE], check=True)
        subprocess.run(["git", "commit", "-m", "Auto-update houseboats.json"], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print("🚀 Changes pushed to GitHub!")
    except subprocess.CalledProcessError as e:
        print("⚠️ Git command failed:", e)

if __name__ == "__main__":
    update_json()
    git_push()
