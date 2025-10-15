export const uploadImage = (req, res) => {
  try {
    console.log("🔄 UPLOAD STARTED ===================================");
    console.log("🌍 Environment:", process.env.NODE_ENV);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ LOG EVERYTHING about the file
    console.log("📸 COMPLETE FILE OBJECT:");
    console.log(JSON.stringify(req.file, null, 2));
    
    console.log("🔍 Checking for Cloudinary properties:");
    console.log("- req.file.url:", req.file.url);
    console.log("- req.file.secure_url:", req.file.secure_url);
    console.log("- req.file.public_id:", req.file.public_id);
    console.log("- req.file.path:", req.file.path);
    console.log("- req.file.filename:", req.file.filename);

    let imageUrl;

    if (process.env.NODE_ENV === 'production') {
      console.log("🚀 PRODUCTION - Checking Cloudinary response...");
      
      // Cloudinary should return the URL in one of these properties
      if (req.file.secure_url) {
        imageUrl = req.file.secure_url;
        console.log("✅ Found secure_url:", imageUrl);
      } else if (req.file.url) {
        imageUrl = req.file.url;
        console.log("✅ Found url:", imageUrl);
      } else if (req.file.path && req.file.path.startsWith('http')) {
        imageUrl = req.file.path;
        console.log("✅ Using path as URL:", imageUrl);
      } else {
        console.log("❌ No Cloudinary URL found in file object");
        console.log("🔄 Constructing URL manually from public_id...");
        
        // Manual URL construction
        if (req.file.public_id) {
          imageUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${req.file.public_id}`;
          console.log("🔧 Manual URL:", imageUrl);
        } else {
          // Last resort - use whatever path we have
          imageUrl = req.file.path;
          console.log("⚠️ Using raw path as fallback:", imageUrl);
        }
      }
    } else {
      console.log("💻 DEVELOPMENT - Using local path");
      imageUrl = `/uploads/${req.file.filename}`;
    }

    console.log("🖼️ FINAL URL BEING SENT:", imageUrl);
    console.log("===================================================");

    res.json({ 
      success: true,
      imageUrl: imageUrl,
      debug: {
        environment: process.env.NODE_ENV,
        usedPublicId: req.file.public_id || 'none'
      }
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};