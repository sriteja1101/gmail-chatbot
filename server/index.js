// // require('dotenv').config();
// // const express = require('express');
// // const session = require('express-session');
// // const passport = require('passport');
// // const { google } = require('googleapis');
// // const { pipeline } = require('@xenova/transformers');
// // const { getPineconeIndex } = require('./lib/pinecone');
// // const { OpenAI } = require('openai');

// // const app = express();
// // app.use(express.json());

// // // Session setup
// // app.use(session({
// //   secret: process.env.SESSION_SECRET,
// //   resave: false,
// //   saveUninitialized: false,
// // }));

// // // Passport auth
// // require('./auth/googleAuth')(passport);
// // app.use(passport.initialize());
// // app.use(passport.session());

// // // OpenAI setup
// // const openai = new OpenAI({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });

// // // Embedding generator
// // let embedder;
// // async function generateEmbedding(text) {
// //   if (!embedder) {
// //     embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
// //   }
// //   const output = await embedder(text, { pooling: 'mean', normalize: true });
// //   return Array.from(output.data);
// // }

// // // OAuth Routes
// // app.get('/auth/google',
// //   passport.authenticate('google', {
// //     scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
// //     accessType: 'offline',
// //     prompt: 'consent',
// //   })
// // );

// // app.get('/auth/google/callback',
// //   passport.authenticate('google', { failureRedirect: '/login-failed' }),
// //   (req, res) => {
// //     res.redirect('/get-emails');
// //   }
// // );

// // // Fetch and embed Gmail messages
// // app.get('/get-emails', async (req, res) => {
// //   if (!req.user) return res.status(401).send('Not authenticated');

// //   try {
// //     const oauth2Client = new google.auth.OAuth2(
// //       process.env.GOOGLE_CLIENT_ID,
// //       process.env.GOOGLE_CLIENT_SECRET
// //     );

// //     oauth2Client.setCredentials({
// //       access_token: req.user.accessToken,
// //       refresh_token: req.user.refreshToken,
// //     });

// //     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
// //     const messagesList = await gmail.users.messages.list({
// //       userId: 'me',
// //       maxResults: 10,
// //     });

// //     const messages = messagesList.data.messages || [];
// //     const index = await getPineconeIndex();
// //     const emailData = [];

// //     for (const msg of messages) {
// //       const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
// //       const headers = detail.data.payload.headers;
// //       const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
// //       const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";

// //       const embedding = await generateEmbedding(subject);

// //       await index.upsert([
// //         {
// //           id: msg.id,
// //           values: embedding,
// //           metadata: { subject, from, text: subject },
// //         }
// //       ]);

// //       emailData.push({ id: msg.id, subject, from });
// //     }

// //     res.json({ message: "Emails embedded and stored in Pinecone", data: emailData });
// //   } catch (err) {
// //     console.error("Error embedding emails:", err);
// //     res.status(500).send("Error while processing emails.");
// //   }
// // });

// // // ✅ Search endpoint (POST /search)
// // app.post('/search', async (req, res) => {
// //   try {
// //     const query = req.body.query;
// //     if (!query) return res.status(400).json({ error: "Query is required" });

// //     const queryEmbedding = await generateEmbedding(query);
// //     const index = await getPineconeIndex();

// //     const searchResult = await index.query({
// //       vector: queryEmbedding,
// //       topK: 5,
// //       includeMetadata: true,
// //     });

// //     const topMatches = searchResult.matches;
// //     if (!topMatches.length) {
// //       return res.status(404).json({ message: "No relevant emails found" });
// //     }

// //     const contextText = topMatches.map((match, i) => `Email ${i + 1}: ${match.metadata.text}`).join("\n\n");

// //     const gptResponse = await openai.chat.completions.create({
// //       model: "gpt-4",
// //       messages: [
// //         {
// //           role: "system",
// //           content: "You are a helpful assistant who answers based on the given email data.",
// //         },
// //         {
// //           role: "user",
// //           content: `User Question: ${query}\n\nRelevant Emails:\n${contextText}`,
// //         },
// //       ],
// //       temperature: 0.3,
// //     });

// //     const finalAnswer = gptResponse.choices[0].message.content;
// //     res.json({ answer: finalAnswer });

// //   } catch (err) {
// //     console.error("Error:", err);
// //     res.status(500).json({ error: "Internal Server Error", details: err.message });
// //   }
// // });

// // // Start server
// // app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));

// // require('dotenv').config();
// // const express = require('express');
// // const session = require('express-session');
// // const passport = require('passport');
// // const { google } = require('googleapis');
// // const { pipeline } = require('@xenova/transformers');
// // const { getPineconeIndex } = require('./lib/pinecone');

// // const app = express();
// // app.use(express.json());

// // // Session setup
// // app.use(session({
// //   secret: process.env.SESSION_SECRET,
// //   resave: false,
// //   saveUninitialized: false,
// // }));

// // // Passport auth
// // require('./auth/googleAuth')(passport);
// // app.use(passport.initialize());
// // app.use(passport.session());

// // // Embedding generator (Xenova only)
// // let embedder;
// // async function generateEmbedding(text) {
// //   if (!embedder) {
// //     embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
// //   }
// //   const output = await embedder(text, { pooling: 'mean', normalize: true });
// //   return Array.from(output.data);
// // }

// // // OAuth Routes
// // app.get('/auth/google',
// //   passport.authenticate('google', {
// //     scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
// //     accessType: 'offline',
// //     prompt: 'consent',
// //   })
// // );

// // app.get('/auth/google/callback',
// //   passport.authenticate('google', { failureRedirect: '/login-failed' }),
// //   (req, res) => {
// //     res.redirect('/get-emails');
// //   }
// // );

// // // Fetch and embed Gmail messages
// // app.get('/get-emails', async (req, res) => {
// //   if (!req.user) return res.status(401).send('Not authenticated');

// //   try {
// //     const oauth2Client = new google.auth.OAuth2(
// //       process.env.GOOGLE_CLIENT_ID,
// //       process.env.GOOGLE_CLIENT_SECRET
// //     );

// //     oauth2Client.setCredentials({
// //       access_token: req.user.accessToken,
// //       refresh_token: req.user.refreshToken,
// //     });

// //     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
// //     const messagesList = await gmail.users.messages.list({
// //       userId: 'me',
// //       maxResults: 10,
// //     });

// //     const messages = messagesList.data.messages || [];
// //     const index = await getPineconeIndex();
// //     const emailData = [];

// //    // Inside /get-emails route, replace the current upsert code with this:
// //     for (const msg of messages) {
// //       const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
// //       const headers = detail.data.payload.headers;
// //       const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
// //       const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";
// //       const date = headers.find(h => h.name === "Date")?.value || "(No Date)";
// //       const bodySnippet = detail.data.snippet || "(No content)"; // Extract email preview

// //       // Generate embedding from SUBJECT + BODY (for better context)
// //       const textToEmbed = `${subject} ${bodySnippet}`;
// //       const embedding = await generateEmbedding(textToEmbed);

// //       // Upsert to Pinecone with full metadata
// //       await index.upsert([
// //         {
// //           id: msg.id,
// //           values: embedding,
// //           metadata: { 
// //             subject, 
// //             from, 
// //             body: bodySnippet,  // Critical for GPT context
// //             date 
// //           },
// //         }
// //       ]);

// //       emailData.push({ id: msg.id, subject, from });
// //     }

// //     res.json({ message: "Emails embedded and stored in Pinecone", data: emailData });
// //   } catch (err) {
// //     console.error("Error embedding emails:", err);
// //     res.status(500).send("Error while processing emails.");
// //   }
// // });




// // // Start server
// // app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));


// require('dotenv').config();
// const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
// const { google } = require('googleapis');
// const { pipeline } = require('@xenova/transformers');
// const { getPineconeIndex } = require('./lib/pinecone');
// const { GoogleGenerativeAI } = require('@google/generative-ai'); // ADDED: Gemini import

// const app = express();
// app.use(express.json());

// // Session setup (required for Google OAuth)
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

// // Passport.js Google OAuth setup
// require('./auth/googleAuth')(passport);
// app.use(passport.initialize());
// app.use(passport.session());

// // ADDED: Gemini setup - MUST BE DECLARED BEFORE `model` USES IT
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// // Xenova embedding generator
// let embedder;
// async function generateEmbedding(text) {
//   if (!embedder) {
//     embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
//   }
//   const output = await embedder(text, { pooling: 'mean', normalize: true });
//   return Array.from(output.data);
// }

// // Google OAuth routes (for browser login)
// app.get('/auth/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
//     accessType: 'offline',
//     prompt: 'consent',
//   })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login-failed' }),
//   (req, res) => {
//     res.redirect('/get-emails'); // After login, fetch emails
//   }
// );

// // Fetch emails & store in Pinecone (called after login)
// app.get('/get-emails', async (req, res) => {
//   if (!req.user) return res.status(401).send('Not authenticated');

//   try {
//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET
//     );

//     oauth2Client.setCredentials({
//       access_token: req.user.accessToken,
//       refresh_token: req.user.refreshToken,
//     });

//     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
//     const index = await getPineconeIndex();

//     let allMessages = [];
//     let nextPageToken = null;

//     // Step 1: Fetch all message IDs
//     do {
//       const response = await gmail.users.messages.list({
//         userId: 'me',
//         maxResults: 500,
//         pageToken: nextPageToken,
//       });

//       const messages = response.data.messages || [];
//       allMessages.push(...messages);
//       nextPageToken = response.data.nextPageToken;

//       console.log(`Fetched ${allMessages.length} message IDs...`);
//     } while (nextPageToken);

//     // Step 2: Fetch metadata instead of full email
//     const batchSize = 500;

//     for (let i = 0; i < allMessages.length; i += batchSize) {
//       const batch = allMessages.slice(i, i + batchSize);
//       const pineconeVectors = [];

//       for (const msg of batch) {
//         const detail = await gmail.users.messages.get({
//           userId: 'me',
//           id: msg.id, 
//           format: 'metadata',
//           metadataHeaders: ['Subject', 'From', 'Date'],
//         });

//         const headers = detail.data.payload.headers || [];
//         const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
//         const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";
//         const date = headers.find(h => h.name === "Date")?.value || "(No Date)";
//         const snippet = detail.data.snippet || "(No content)";

//         const textToEmbed = `${subject} ${snippet}`;
//         const embedding = await generateEmbedding(textToEmbed);

//         pineconeVectors.push({
//           id: msg.id,
//           values: embedding,
//           metadata: {
//             subject,
//             from,
//             date,
//             body: snippet,
//           },
//         });
//       }

//       await index.upsert(pineconeVectors);
//       console.log(`Upserted ${pineconeVectors.length} emails to Pinecone`);
//     }

//     res.json({ success: true, message: `${allMessages.length} emails stored in Pinecone` });
//   } catch (err) {
//     console.error("Error fetching emails:", err);
//     res.status(500).send("Error processing emails.");
//   }
// });


// // Optimized Query Endpoint (for Postman/browser)
// app.post('/query', async (req, res) => {
//   try {
//     const { query } = req.body;
//     if (!query) return res.status(400).json({ error: "Query is required" });

//     // Step 1: Generate embedding for the query
//     const queryEmbedding = await generateEmbedding(query);
//     const index = await getPineconeIndex();

//     // Step 2: Search Pinecone for top 5 relevant emails
//     const searchResults = await index.query({
//       vector: queryEmbedding,
//       topK: 10000, // Get more emails for better context
//       includeMetadata: true,
//     });

//     if (!searchResults.matches.length) {
//       return res.json({ answer: "No relevant emails found.", relevantEmails: [] });
//     }

//     // Step 3: Format email context for Gemini
//     const emailContext = searchResults.matches.map((match, i) => (
//       `[Email ${i + 1}]\n` +
//       `Subject: ${match.metadata.subject}\n` +
//       `From: ${match.metadata.from}\n` +
//       `Date: ${match.metadata.date}\n` +
//       `Content: ${match.metadata.body}\n`
//     )).join('\n');

    
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // Construct the prompt for Gemini
//     const prompt = `You are an email assistant. Answer the user's query using ONLY the provided email context.

//     QUESTION: ${query}

//     EMAIL CONTEXT:
//     ${emailContext}

//     ANSWER:`;

//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: {
//         temperature: 0.3,
//         maxOutputTokens: 500, 
//       },
//     });

//     const response = await result.response; 
//     const answer = response.text(); 

//     // Step 5: Return response + relevant emails
//     res.json({
//       answer,
//       relevantEmails: searchResults.matches.map(match => ({
//         subject: match.metadata.subject,
//         from: match.metadata.from,
//         date: match.metadata.date,
//         snippet: match.metadata.body,
//       })),
//     });

//   } catch (err) {
//     console.error("Query error:", err);
//     res.status(500).json({ error: "Failed to process query." });
//   }
// });

// // Start server
// app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { google } = require('googleapis');
const { pipeline } = require('@xenova/transformers');
const { getPineconeIndex } = require('./lib/pinecone');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 

const app = express();
app.use(express.json());

// Session setup (required for Google OAuth)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Passport.js Google OAuth setup
require('./auth/googleAuth')(passport);
app.use(passport.initialize());
app.use(passport.session());

// ADDED: Gemini setup - MUST BE DECLARED BEFORE `model` USES IT
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// IMPORTANT: Declare 'model' inside the function where it's used,
// or at least after 'genAI' is initialized.
// For the `/query` endpoint, it's best to get the model instance there
// as some configurations might change or to ensure it's always fresh.
// I've moved the model declaration back into the /query endpoint,
// and set it to `gemini-1.5-flash` as a common working option.
// If you want `gemini-1.5-pro`, make sure your API key has access.
// REMOVED from global scope: const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });


// Xenova embedding generator
let embedder;
async function generateEmbedding(text) {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

// Google OAuth routes (for browser login)
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
    accessType: 'offline',
    prompt: 'consent',
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req, res) => {
    res.redirect('/get-emails'); // After login, fetch emails
  }
);

// Fetch emails & store in Pinecone (called after login)
app.get('/get-emails', async (req, res) => {
  if (!req.user) return res.status(401).send('Not authenticated');

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: req.user.accessToken,
      refresh_token: req.user.refreshToken,
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const messagesList = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10, // Increased to fetch more emails
    });

    const messages = messagesList.data.messages || [];
    const index = await getPineconeIndex();

    for (const msg of messages) {
      const detail = await gmail.users.messages.get({ userId: 'me', id: msg.id });
      const headers = detail.data.payload.headers;
      const subject = headers.find(h => h.name === "Subject")?.value || "(No Subject)";
      const from = headers.find(h => h.name === "From")?.value || "(Unknown Sender)";
      const date = headers.find(h => h.name === "Date")?.value || "(No Date)";
      const bodySnippet = detail.data.snippet || "(No content)";

      // Store subject + body snippet in Pinecone for better search
      const textToEmbed = `${subject} ${bodySnippet}`;
      const embedding = await generateEmbedding(textToEmbed);

      await index.upsert([
        {
          id: msg.id,
          values: embedding,
          metadata: {
            subject,
            from,
            date,
            body: bodySnippet, // Store full snippet for GPT context
          },
        }
      ]);
    }

    res.json({ success: true, message: `${messages.length} emails stored in Pinecone` });
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).send("Error processing emails.");
  }
});

// Optimized Query Endpoint (for Postman/browser)
app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

    // Step 1: Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);
    const index = await getPineconeIndex();

    // Step 2: Search Pinecone for top 5 relevant emails
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 5, // Get more emails for better context
      includeMetadata: true,
    });

    if (!searchResults.matches.length) {
      return res.json({ answer: "No relevant emails found.", relevantEmails: [] });
    }

    // Step 3: Format email context for Gemini
    const emailContext = searchResults.matches.map((match, i) => (
      `[Email ${i + 1}]\n` +
      `Subject: ${match.metadata.subject}\n` +
      `From: ${match.metadata.from}\n` +
      `Date: ${match.metadata.date}\n` +
      `Content: ${match.metadata.body}\n`
    )).join('\n');

    // Step 4: Ask Gemini to generate a response
    // IMPORTANT: Get the model here inside the function to ensure `genAI` is initialized.
    // I've changed the model name to `gemini-1.5-flash` as it's generally available and performant.
    // If you specifically need `gemini-1.5-pro` and have access, you can change it back.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct the prompt for Gemini
    const prompt = `You are an email assistant. Answer the user's query using ONLY the provided email context.

QUESTION: ${query}

EMAIL CONTEXT:
${emailContext}

ANSWER:`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500, // Equivalent to max_tokens for Gemini
      },
    });

    const response = await result.response; // Await the response object
    const answer = response.text(); // Get the text content from the response

    // Step 5: Return response + relevant emails
    res.json({
      answer,
      relevantEmails: searchResults.matches.map(match => ({
        subject: match.metadata.subject,
        from: match.metadata.from,
        date: match.metadata.date,
        snippet: match.metadata.body,
      })),
    });

  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ error: "Failed to process query." });
  }
});

// Start server
app.listen(5000, () => console.log('✅ Server running on http://localhost:5000'));