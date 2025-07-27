// Add this route to test Pinecone connection
app.get('/test-index', async (req, res) => {
  try {
    const { getPineconeIndex } = require('./lib/pinecone');
    const index = await getPineconeIndex();
    const stats = await index.describeIndexStats();
    
    res.json({
      status: "Success!",
      index: process.env.PINECONE_INDEX_NAME,
      dimension: stats.dimension,
      recordCount: stats.totalVectorCount
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      config: {
        apiKey: process.env.PINECONE_API_KEY ? "***" : "MISSING",
        environment: process.env.PINECONE_ENVIRONMENT,
        indexName: process.env.PINECONE_INDEX_NAME
      }
    });
  }
});