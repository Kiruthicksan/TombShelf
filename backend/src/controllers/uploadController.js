export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("📸 Uploaded file info:", req.file);

   
    let imageUrl;

    if (process.env.NODE_ENV === 'production') {
     
      imageUrl = req.file.path;
      
      
      if (!imageUrl.startsWith('http')) {
        console.error('❌ Expected Cloudinary URL in production, got:', imageUrl);
        return res.status(500).json({ error: 'Image upload configuration error' });
      }
    } else {
     
      imageUrl = `/uploads/${req.file.filename}`;
    }

    console.log("🖼️ Final image URL:", imageUrl);

    res.json({ 
      success: true,
      imageUrl: imageUrl
    });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};