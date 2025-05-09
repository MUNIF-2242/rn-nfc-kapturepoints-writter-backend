const {
  TextractClient,
  DetectDocumentTextCommand,
} = require("@aws-sdk/client-textract");

require("dotenv").config();

const textractClient = new TextractClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
  },
});

exports.extractLicenseInfo = async (req, res) => {
  const { fileName } = req.body;

  if (!fileName) {
    return res.status(400).send("No file name provided.");
  }

  const params = {
    Document: {
      S3Object: {
        Bucket: process.env.YOUR_S3_BUCKET_NAME,
        Name: fileName,
      },
    },
  };

  try {
    const command = new DetectDocumentTextCommand(params);
    const textractData = await textractClient.send(command);
    const lineBlocks = textractData.Blocks.filter(
      (b) => b.BlockType === "LINE"
    );

    let licenseHolderName,
      licenseIssueDate,
      dateOfBirth,
      licenseExpirationDate,
      bloodGroup,
      fatherName,
      licenseNo;

    for (let i = 0; i < lineBlocks.length; i++) {
      const text = lineBlocks[i].Text.trim().toLowerCase();

      switch (true) {
        case text.includes("name"):
          licenseHolderName = lineBlocks[i + 1]?.Text?.trim();
          break;
        case text.includes("birth"):
          dateOfBirth = lineBlocks[i + 1]?.Text?.trim();
          break;
        case text.includes("group"):
          bloodGroup = lineBlocks[i + 1]?.Text?.trim();
          break;
        case text.includes("father"):
          fatherName = lineBlocks[i + 1]?.Text?.trim();
          break;
        case text.includes("authority"):
          licenseNo = lineBlocks[i + 1]?.Text?.trim().substring(0, 16);
          break;
        case text.includes("validity"):
          licenseIssueDate = lineBlocks[i + 1]?.Text?.trim();
          break;
        case text.includes("licence no"):
          licenseExpirationDate = lineBlocks[i - 1]?.Text?.trim();
          break;
      }
    }

    const allExtracted =
      licenseHolderName &&
      licenseIssueDate &&
      dateOfBirth &&
      licenseExpirationDate &&
      bloodGroup &&
      fatherName;

    let dateValid = false;
    if (licenseIssueDate && licenseExpirationDate) {
      const today = new Date();
      const issueDate = new Date(licenseIssueDate);
      const expDate = new Date(licenseExpirationDate);
      dateValid = issueDate <= today && expDate >= today;
    }

    res.json({
      status: allExtracted && dateValid ? "success" : "fail",
      licenseData: {
        licenseHolderName,
        dateOfBirth,
        bloodGroup,
        fatherName,
        licenseIssueDate,
        licenseExpirationDate,
        licenseNo,
        isLicenseDateValid: dateValid,
      },
    });
  } catch (error) {
    console.error("Textract error:", error);
    res.status(500).json({ status: "error", message: "Textract failed." });
  }
};
