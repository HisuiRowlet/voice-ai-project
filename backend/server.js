require("dotenv").config();
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer();

app.post("/upload", upload.single("audio"), async (req, res) => {
  try {
    console.log("Audio received, size:", req.file.buffer.length, "bytes");
    console.log("Sending to n8n:", process.env.N8N_WEBHOOK_URL);

    const response = await axios.post(
      process.env.N8N_WEBHOOK_URL,
      req.file.buffer,
      {
        headers: {
          "Content-Type": "audio/webm",
        },
      }
    );

    console.log("n8n response:", JSON.stringify(response.data));
    res.json(response.data);

  } catch (err) {
    console.error("ERROR:", err.response?.data || err.message);
    res.status(500).json({ reply: "Error: " + (err.response?.data?.message || err.message) });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});