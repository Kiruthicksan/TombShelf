export const uploadImage = (req, res) => {
  try {
    const imageUrl = req.file.path;
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
