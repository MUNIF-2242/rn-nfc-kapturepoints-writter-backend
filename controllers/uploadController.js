const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Buffer } = require("buffer");
require("dotenv").config();

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
  },
});

console.log("S3 Client initialized.............");
console.log(process.env.YOUR_AWS_ACCESS_KEY_ID);
console.log(process.env.YOUR_AWS_SECRET_ACCESS_KEY);

exports.uploadNid = async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).send("No image data provided.");
  }

  const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = "license.jpg";

  const params = {
    Bucket: process.env.YOUR_S3_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: "image/jpeg",
  };
  console.log(params);
  try {
    console.log("Attempting to upload to S3...");
    const result = await s3.send(new PutObjectCommand(params));

    console.log("S3 Upload Success:", result);

    const imageUrl = `https://${process.env.YOUR_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    res.json({
      imageUrl,
      fileName,
    });
  } catch (error) {
    console.error("S3 Upload Error:", error);
    res.status(500).send("Error uploading image.");
  }
};
