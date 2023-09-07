// modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const imageKit = require("imagekit");
const morgan = require("morgan");

// init
const app = express();
const port = process.env.PORT || 5000;
const uploadMulter = multer();

// control cors
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
  optionSuccessStatus: 200,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// imagekit authentication
const imagekit = new imageKit({
  publicKey: process.env.IK_PL_KEY,
  privateKey: process.env.IK_PV_KEY,
  urlEndpoint: `https://ik.imagekit.io/` + process.env.IK_ID,
});

// upload image to imagekit
const uploadToIK = async (req, res) => {
  let fieldName = req.file.fieldname.replace("Img", "");

  switch (fieldName) {
    case "user":
      fieldName = "users";
      break;
    default:
      fieldName = "";
  }

  imagekit
    .upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
      folder: `taskee/${fieldName}`,
    })
    .then((response) => res.send(response))
    .catch((error) => res.send(error));
};

// upload user image
app.post("/users/upload", uploadMulter.single("userImg"), uploadToIK);

// check api running or not
app.get("/", (req, res) => {
  res.send("Taskee is running...");
});

app.listen(port, () => {
  console.log(`Taskee API is running on port: ${port}`);
});
