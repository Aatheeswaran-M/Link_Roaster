const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const Roast = require('../models/Roast');
const { scrapeUrl } = require('../utils/scraper');
const auth = require('../middleware/auth');

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const isValidUrl = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

const generateRoast = async (title, scrapedText, language = 'English', retries = 1) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const prompt = `You are a witty, sharp, and slightly savage content critic. Given the following webpage content, generate a JSON response with exactly these fields:
- summary: A clear, slightly elaborate 3-5 sentence summary of what this page is about, explaining its core purpose and key points.
- interesting: What is genuinely interesting or noteworthy about it (1-2 sentences)
- questionable: What seems questionable, overhyped, or suspicious about it (1-2 sentences, be funny)
- verdict: A single savage/funny one-liner verdict about this page
- category: A single word or short phrase categorizing the content (e.g., Tech, News, Blog, Product, Social Media)

CRITICAL MODERATION RULE: If the page content is about a tragedy, death, abuse, or highly serious/sad news, do NOT be savage or funny. Instead, be respectful, provide a somber summary, and set the verdict to something reflecting the serious nature.

CRITICAL REQUIREMENT: You MUST translate and generate ALL your written text responses strictly in ${language}. 
IMPORTANT: DO NOT translate the JSON keys themselves. The keys MUST remain exactly "summary", "interesting", "questionable", "verdict", and "category" in English. Only translate the values.

Page Title: ${title}
Page Content: ${scrapedText}

Respond ONLY with valid JSON, no markdown, no explanation.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          "role": "user",
          "content": prompt
        }
      ],
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    const responseText = completion.choices[0].message.content;
    
    // Clean up potential markdown formatting in response (e.g., ```json ... ```)
    let jsonString = responseText.trim();
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7);
    }
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.substring(3);
    }
    if (jsonString.endsWith('```')) {
      jsonString = jsonString.substring(0, jsonString.length - 3);
    }
    
    return JSON.parse(jsonString.trim());
  } catch (error) {
    if (retries > 0) {
      console.log('AI parsing failed, retrying...');
      return await generateRoast(title, scrapedText, language, retries - 1);
    }
    throw new Error('Failed to generate a valid roast from AI.');
  }
};

router.post('/roast', async (req, res) => {
  const { url, language } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Please provide a valid URL starting with http:// or https://' });
  }

  let authUser = null;
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      authUser = await User.findById(decoded.userId);
    }
  } catch (e) {
    // Ignore token errors for guests
  }

  try {
    // 0. Check for existing roast for this user
    if (authUser) {
      const existingRoast = await Roast.findOne({ url, user: authUser._id });
      if (existingRoast) {
        return res.status(200).json(existingRoast);
      }
    } else {
      const existingRoast = await Roast.findOne({ url, user: null });
      if (existingRoast) {
        return res.status(200).json(existingRoast);
      }
    }

    // 1. Scrape the URL
    const { title, ogImage, scrapedText } = await scrapeUrl(url);

    // 2. Generate roast with AI
    const roastData = await generateRoast(title, scrapedText, language);

    // 3. Save to MongoDB
    const newRoast = new Roast({
      url,
      user: authUser ? authUser._id : null,
      title,
      ogImage,
      summary: roastData.summary,
      interesting: roastData.interesting,
      questionable: roastData.questionable,
      verdict: roastData.verdict,
      category: roastData.category || 'Uncategorized',
    });

    await newRoast.save();

    // 4. Return the roast object
    res.status(201).json(newRoast);
  } catch (error) {
    console.error('Error processing roast:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
});

router.get('/roasts', async (req, res) => {
  try {
    const roasts = await Roast.find().populate('user', 'name').sort({ createdAt: -1 }).limit(20).lean();
    res.json(roasts);
  } catch (error) {
    console.error('Error fetching roasts:', error);
    res.status(500).json({ error: 'Failed to fetch roasts.' });
  }
});

router.get('/roasts/me', auth, async (req, res) => {
  try {
    const roasts = await Roast.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json(roasts);
  } catch (error) {
    console.error('Error fetching user roasts:', error);
    res.status(500).json({ error: 'Failed to fetch history.' });
  }
});
router.post('/translate', auth, async (req, res) => {
  const { targetLanguage, roastContent } = req.body;
  if (!targetLanguage || !roastContent) {
    return res.status(400).json({ error: 'Missing language or content' });
  }

  const prompt = `You are a translator. Translate the following JSON object's string values into ${targetLanguage}.
CRITICAL REQUIREMENT: DO NOT translate the JSON keys. Keep them exactly as they are. Only translate the values.
Input JSON:
${JSON.stringify(roastContent, null, 2)}

Respond ONLY with valid JSON containing the translated values. No markdown, no explanation.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });
    
    let jsonString = completion.choices[0].message.content.trim();
    if (jsonString.startsWith('```json')) jsonString = jsonString.substring(7);
    if (jsonString.startsWith('```')) jsonString = jsonString.substring(3);
    if (jsonString.endsWith('```')) jsonString = jsonString.substring(0, jsonString.length - 3);
    
    const translatedContent = JSON.parse(jsonString.trim());
    res.json(translatedContent);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Failed to translate content.' });
  }
});

router.delete('/roast/:id', auth, async (req, res) => {
  try {
    const roast = await Roast.findById(req.params.id);
    
    if (!roast) {
      return res.status(404).json({ error: 'Roast not found' });
    }

    // Ensure the user owns this roast
    if (roast.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Not authorized to delete this roast' });
    }

    await roast.deleteOne();
    res.json({ message: 'Roast removed successfully' });
  } catch (error) {
    console.error('Error deleting roast:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Roast not found' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/roasts/me', auth, async (req, res) => {
  try {
    await Roast.deleteMany({ user: req.user._id });
    res.json({ message: 'All history cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history.' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const User = require('../models/User'); // require it here to avoid circular dependencies if any, or just at the top
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

module.exports = router;
