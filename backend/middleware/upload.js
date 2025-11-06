const multer = require("multer");

// konfigurasi tempat dan nama file yang diupload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img"); // folder tempat menyimpan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // nama file
  },
});

// filter hanya file gambar yang diijinkan
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
