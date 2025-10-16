export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

   
    const imageUrl = req.file.path;

    res.json({
      success: true,
      imageUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
};
