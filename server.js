
require('dotenv').config(); 
const express = require('express');
// CORS को कॉन्फ़िगर करने के लिए cors पैकेज का उपयोग करें
const cors = require('cors'); 
const { GoogleGenAI } = require('@google/genai');

// --- 1. CONFIGURATION & KEY CHECK ---
const PORT = process.env.PORT || 3000;
const app = express();
const GEMINI_MODEL = 'gemini-2.5-flash'; 

// API Key Environment Variable से लोड होगी
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error("❌ FATAL ERROR: GEMINI_API_KEY environment variable is NOT set.");
    // Render/Vercel/किसी भी होस्टिंग पर, अगर ENV VAR नहीं है तो तुरंत बाहर निकलना सही है।
    process.exit(1); 
}
console.log(`Debug Check: API Key loaded (Length): ${GEMINI_API_KEY.length > 5 ? GEMINI_API_KEY.length : 'Too Short!'}`);

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 

// --- 2. MIDDLEWARE SETUP: CORS FIX (सबसे महत्वपूर्ण) ---

// CORS कॉन्फ़िगरेशन: सिर्फ़ आपके GitHub Pages डोमेन को अनुमति दें
// 'https://ltslucky038-ai.github.io' आपका फ्रंटएंड डोमेन है
const allowedOrigins = [
    'https://ltslucky038-ai.github.io', 
    'http://127.0.0.1:5500', // लोकल टेस्टिंग (VS Code Live Server) के लिए जोड़ा गया
    'http://localhost:5500',  // लोकल टेस्टिंग के लिए जोड़ा गया
    'http://localhost:3000'   // लोकल टेस्टिंग के लिए जोड़ा गया
]
const corsOptions = {
  origin: function (origin, callback) {
    // अगर रिक्वेस्ट का 'origin' allowedOrigins array में है, या अगर कोई origin नहीं है (जैसे Postman या same-origin request), तो अनुमति दें।
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS Blocked: Origin ${origin} not allowed.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST', // सिर्फ़ जरूरी मेथड्स को अनुमति दें
  optionsSuccessStatus: 200 // पुराने ब्राउज़र के लिए
};

app.use(cors(corsOptions)); 

// पुराने कस्टम CORS ब्लॉक को हटा दिया गया है
// app.use((req, res, next) => { ... });

app.use(express.json()); 

// अगर आपका फ्रंटएंड GitHub Pages पर है, तो आपको इस static line की ज़रूरत नहीं है
// app.use(express.static('public')); 

// --- 3. SYSTEM INSTRUCTION (जैसा आपने दिया है) ---
const SYSTEM_INSTRUCTION = `
You are 'Vision', an AI Assistant specializing in real-time information and conversational AI. You have access to the Google Search tool for current data, which you must use for real-time queries (like weather, news, or current events). 

Your persona is friendly, helpful, and you respond in Hindi/Hinglish unless the user explicitly asks for English.

---
**I. Crucial Instruction for LIVE Weather Data:**
When a user asks for weather, you **MUST** use the Google Search tool to fetch the **LIVE, CURRENT, and FORECAST** data. You must provide a comprehensive report that includes all details and forecasts in the **EXACT STRUCTURE** below. You **MUST** populate the hourly and daily forecast with the **ACTUAL** values obtained from the search, not mock data.

[Weather Report Structure]
Weather for [City Name] is currently [Current Temp]°C and [Description of Weather].
Details: Humidity: [Value]%, Wind speed: [Value] km/h, Pressure: [Value] hPa, UV Index: [Value], Air Quality: [AQI Description] ([AQI Index]).
Hourly Forecast: [[Time]h, [Actual Temp]°C, [Actual Description]], [[Time]h, [Actual Temp]°C, [Actual Description]], [[Time]h, [Actual Temp]°C, [Actual Description]].
Daily Forecast: [[Day], [Actual Max Temp]°C, [Actual Min Temp]°C, [Actual Description]], [[Day], [Actual Max Temp]°C, [Actual Min Temp]°C, [Actual Description]], [[Day], [Actual Max Temp]°C, [Actual Min Temp]°C, [Actual Description]].

Example:
Weather for Mumbai is currently 28°C and clear sky.
Details: Humidity: 75%, Wind speed: 10 km/h, Pressure: 1010 hPa, UV Index: 6, Air Quality: Good (45).
Hourly Forecast: [3h, 29°C, clear sky], [6h, 30°C, sunny], [9h, 29°C, partly cloudy].
Daily Forecast: [Tue, 32°C, 25°C, Sunny], [Wed, 31°C, 24°C, Cloudy], [Thu, 30°C, 23°C, Rain].

---
**II. Instruction for LIVE News Data (News Bot Feature):**
When a user asks for **current news** (e.g., "aaj ki khabar," "latest news," "top headlines"), you **MUST** use the Google Search tool. Summarize the **top 3-5 relevant and recent headlines** conversationally in Hindi/Hinglish. Present the information clearly and concisely.

---
**III. General Interaction:**
For all other non-weather/non-news queries, respond conversationally and helpfully in Hindi/Hinglish.
`;
// ---------------------------------------------


// --- 4. API CALL FUNCTION using SDK ---
async function callGeminiApi(userQuery, history) {
    const contents = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: msg.parts
    }));

    const config = {
        tools: [{ googleSearch: {} }], 
        systemInstruction: SYSTEM_INSTRUCTION,
    };
    
    // हर बार एक नया चैट सेशन शुरू करें और पूरा इतिहास पास करें
    const chat = ai.chats.create({ 
        model: GEMINI_MODEL, 
        history: contents, 
        config: config
    });
    
    const result = await chat.sendMessage({ message: userQuery });
    
    const botText = result.text;
    let sources = [];

    // Sources metadata निकालें
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata && groundingMetadata.groundingChunks) {
        const uniqueSources = new Set();
        sources = groundingMetadata.groundingChunks
            .map(chunk => ({
                uri: chunk.web?.uri,
                title: chunk.web?.title,
            }))
            .filter(source => source.uri && source.title && !uniqueSources.has(source.uri) && uniqueSources.add(source.uri));
    }
    
    return { botText, sources };
}


// --- 5. CHAT ENDPOINT ---
app.post('/api/chat', async (req, res) => {
    const { message, history } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await callGeminiApi(message, history || []);
        
        // console.log('Gemini Full Response:', response.botText); 
        
        res.status(200).json(response); 

    } catch (error) {
        console.error('❌ Gemini API call failed:', error.message);
        
        let clientStatus = 500;
        let errorMsg = 'API call mein koi error hai: Internal Server Error.';

        if (error.message.includes('API_KEY_INVALID') || error.message.includes('403') || error.message.includes('401')) {
            clientStatus = 403; 
            errorMsg = "API Access Denied (Status 403/401). कृपया अपनी GEMINI_API_KEY और Google Cloud पर Billing status की जाँच करें।"; 
        }

        res.status(clientStatus).json({ 
            botText: errorMsg,
            sources: [] 
        });
    }
});

// --- 6. HEALTH CHECK (Render के लिए महत्वपूर्ण) ---
app.get('/', (req, res) => {
    // Render health check के लिए
    res.status(200).send({ status: 'Vision AI API is running and healthy.' });
});

// --- 7. SERVER START ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log("-----------------------------------------------------");
    console.log(`✅ Server ready on port ${PORT}.`);
    console.log("-----------------------------------------------------");
});
