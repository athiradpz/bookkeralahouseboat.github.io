require('dotenv').config();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});


// Folders to fetch
const categories = ["Deluxe", "Premium", "Luxury", "Ultraluxury"];

async function fetchImages() {
  let data = {};

  for (let category of categories) {
    data[category] = [];
    for (let i = 1; i <= 5; i++) {
      const folderPath = `houseboats/${category}/${i}`;
      const res = await cloudinary.search
        .expression(`folder:${folderPath}`)
        .sort_by('public_id', 'asc')
        .max_results(100)
        .execute();

      const imageUrls = res.resources.map(file => file.secure_url);
      data[category].push({
        id: i,
        folder: folderPath,
        images: imageUrls
      });
    }
  }

  fs.writeFileSync('houseboats.json', JSON.stringify(data, null, 2));
  console.log("✅ houseboats.json created successfully!");
}

fetchImages().catch(console.error);
