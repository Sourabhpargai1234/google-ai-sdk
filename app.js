const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.API_KEY;

// Initialize Google Generative AI instance
const genAI = new GoogleGenerativeAI(apiKey);
const corsOptions = {
  origin: 'https://counsellor-frontend.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Enable credentials (cookies, authorization headers)
};

app.use(cors(corsOptions));

// Middleware to parse JSON request body
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Model deployment successful!');
  });

// Define a route for generating content
app.post('/generate-story', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent(prompt);
    const response =  result.response;
    const text =  response.text();

    res.json({ Response: text });
  } catch (error) {
    console.error('Error generating story:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
