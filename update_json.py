import json

# Load existing JSON
with open("houseboats.json", "r") as f:
    data = json.load(f)

# Function to recursively update URLs
def update_urls(obj, base_url):
    if isinstance(obj, dict):
        for k, v in obj.items():
            obj[k] = update_urls(v, base_url)
    elif isinstance(obj, list):
        return [update_urls(i, base_url) for i in obj]
    elif isinstance(obj, str) and obj.endswith(".jpg"):
        filename = obj.split("/")[-1]  # get filename
        return f"{base_url}/houseboats/Deluxe/2/{filename}"
    return obj

# Base URL for your Cloudinary
base_url = "https://res.cloudinary.com/dnzjznp7t/image/upload/v1752690329"

# Update data
updated_data = update_urls(data, base_url)

# Save back to file
with open("houseboats.json", "w") as f:
    json.dump(updated_data, f, indent=2)

print("✅ houseboats.json updated successfully!")
