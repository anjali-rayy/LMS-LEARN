const express = require("express");
const multer = require("multer");
const fs = require("fs");
const {
  uploadMediaToCloudinary,
  deleteMediaFromCloudinary,
} = require("../../helpers/cloudinary");

const router = express.Router();

// Ensure 'uploads' folder exists
const uploadFolder = "uploads/";
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

const upload = multer({ dest: uploadFolder });

// SINGLE FILE UPLOAD
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const result = await uploadMediaToCloudinary(req.file.path);

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message || "Error uploading file" });
  }
});

// DELETE MEDIA
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Asset ID is required" });
    }

    await deleteMediaFromCloudinary(id);

    res.status(200).json({ success: true, message: "Asset deleted successfully from Cloudinary" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: error.message || "Error deleting file" });
  }
});

// BULK UPLOAD
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(async (fileItem) => {
      const result = await uploadMediaToCloudinary(fileItem.path);
      fs.unlinkSync(fileItem.path); // delete local file after upload
      return result;
    });

    const results = await Promise.all(uploadPromises);

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ success: false, message: error.message || "Error in bulk uploading files" });
  }
});

module.exports = router;
