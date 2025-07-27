
const express = require("express");
const dotenv = require("dotenv");
const { google } = require("googleapis");
const { pipeline } = require("@xenova/transformers");

dotenv.config();
const app = express();
const PORT = 3001;

// Google OAuth2 Setup
const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: "http://localhost:3001/auth/callback",
});

// Step 1: Redirect user to Google login
app.get("/auth", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
  });
  res.redirect(url);
});

// Step 2: Google callback with code
app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = response.data.messages;
    if (!messages || messages.length === 0) {
      return res.send("📭 No emails found.");
    }

    const emailData = [];

    for (const msg of messages) {
      const msgDetail = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
      });

      const headers = msgDetail.data.payload.headers;
      const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
      const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";

      let body = "";
      const parts = msgDetail.data.payload.parts;
      if (parts) {
        const textPart = parts.find(p => p.mimeType === "text/plain");
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
        }
      } else if (msgDetail.data.payload.body?.data) {
        body = Buffer.from(msgDetail.data.payload.body.data, "base64").toString("utf-8");
      }

      emailData.push({ subject, from, body });
    }

    // Load embedding model
    const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    const embeddedEmails = [];

    for (const email of emailData) {
      console.log(`🔍 Embedding email: ${email.subject}`);
      const result = await embed(email.body);
      const vector = result.data[0];

      embeddedEmails.push({
        subject: email.subject,
        from: email.from,
        embedding: vector,
      });
    }

    console.log("✅ Emails converted into embeddings:");
    console.dir(embeddedEmails, { depth: null });

    res.send("✅ Emails fetched and converted to embeddings!");
  } catch (error) {
    console.error("❌ Something went wrong:", error);
    res.status(500).send("Error during processing.");
  }
});
app.get('/search', async (req, res) => {
  const queryText = req.query.q;
  if (!queryText) return res.status(400).json({ error: "Use ?q=your+search+text" });

  try {
    const embedding = await getEmbedding(queryText);

    const results = await pineconeIndex.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
    });

    const hits = (results.matches || []).map(m => ({
      id: m.id,
      score: m.score,
      subject: m.metadata.subject,
      from: m.metadata.from,
    }));

    return res.json({ hits });
  } catch (err) {
    console.error('❌ Search error:', err);
    return res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}/auth`);
});