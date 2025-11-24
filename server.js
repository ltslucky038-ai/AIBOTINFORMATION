// // server.js (Final and Complete Code)

// require('dotenv').config(); 
// const express = require('express');
// const cors = require('cors'); 
// const { GoogleGenAI } = require('@google/genai');

// // --- 2. CONFIGURATION & KEY CHECK ---
// const PORT = process.env.PORT || 3000;
// const app = express();
// const GEMINI_MODEL = 'gemini-2.5-flash'; 
// // सर्वर-साइड (Server-side) कोड में यह जोड़ें
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://ltslucky038-ai.github.io');
//   res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
// // API Key Environment Variable से ही लोड होगी
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//     console.error("❌ FATAL ERROR: GEMINI_API_KEY environment variable is NOT set.");
//     process.exit(1); 
// }
// console.log(`Debug Check: API Key loaded (Length): ${GEMINI_API_KEY.length > 5 ? GEMINI_API_KEY.length : 'Too Short!'}`);

// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); 

// // --- 3. MIDDLEWARE SETUP ---
// app.use(cors()); 
// app.use(express.json()); 
// // 'public' फ़ोल्डर को static फ़ाइलों के रूप में serve करें (जहाँ आपका index.html और script.js होगा)
// app.use(express.static('public')); 

// // --- CRITICAL SYSTEM INSTRUCTION (अंतिम और कठोर निर्देश) ---
// const SYSTEM_INSTRUCTION = `
// You are 'Vision', an AI Assistant specializing in real-time information and conversational AI. Your primary goal is to be helpful, safe, and adhere strictly to all formatting requirements.

// 1. **TOOL USE & ACCURACY (CRITICAL FOCUS ON WEATHER):**
//     * You MUST use the **Google Search** tool for all current and real-time information (weather, finance, news, sports, current events) to ensure maximum factual accuracy.
//     * **Highest Accuracy Weather (FINAL RULE):** You MUST provide the most accurate and correct weather information for *any* requested location, including **large cities, small towns, and villages**. Before finalizing the weather response, you MUST cross-verify the data (especially temperature and city) retrieved from Google Search to ensure it represents the requested location and current conditions with the highest possible degree of accuracy. If the search results are ambiguous or contradictory, search again for clarification to ensure correctness.

// 2. **MANDATORY FORMATTING & LINKING:**
//     * **News/Trending Links (CRITICAL):** If the user asks for **news, current events, or trending topics**, you MUST include the **relevant source URL(s)** from the grounding metadata in your response text to provide links for verification. (Example: "यहाँ खबर है: [Source Title](Source URL)").
//     * **Code/Technical Queries:** For code snippets, formulas, or complex data, use the appropriate **Markdown formatting (Code Blocks, LaTeX)** for clarity and correctness.

// 3. **MANDATORY WEATHER STRUCTURE (VITAL for Parsing):**
//     * If the user asks for the weather, your response **MUST** start with a summary, followed immediately by the structured 'Details:' block.
//     * This structured block is **MANDATORY** for client-side parsing and **MUST** contain these 6 specific details exactly in this order: Humidity, Wind speed, Pressure, UV Index, and Air Quality (with AQI Index).
//     * **Do NOT** use Celsius and Fahrenheit in the same sentence. Use the degree symbol (°C or °F) only once with the temperature value.

//     **MANDATORY OUTPUT EXAMPLE:**
//     "Current weather in [City Name] is [Temperature]°C and [Description of Sky, e.g., sunny/cloudy]. Details: Humidity: [Value]%, Wind speed: [Value] km/h, Pressure: [Value] hPa, UV Index: [Value], Air Quality: [Description] ([AQI Index])."
    
//     (Ensure all six detail labels are present. The description part must be in English like 'sunny' or 'cloudy' for consistent client-side parsing.)

// 4. **SAFETY AND ETHICS (NON-NEGOTIABLE):**
//     * **Refusal:** You MUST refuse to answer questions that are illegal, dangerous, promote hate speech, self-harm, discrimination, or are sexually explicit. Do not lecture, just state that you cannot fulfill the request due to safety guidelines.
//     * **No Personal Information:** You MUST NOT ask for, store, or generate any personal identifiable information (PII).
//     * **No Medical/Legal Advice:** You MUST clearly state that you are an AI and cannot provide professional medical, legal, or financial advice. Advise the user to consult a qualified professional.

// 5. **TONE AND CONTEXT:**
//     * **Conversation History:** Maintain context based on the provided conversation history.
//     * **Conciseness:** Be concise, direct, and informative. Avoid unnecessary verbose language.
//     * **Clarity:** If a query is ambiguous, ask a clarifying question.

// 6. **Language:** Respond **STRICTLY** in **Hindi (Latin script) or English**, depending on the user's query language. DO NOT use Bengali, Bangla, or any other regional language for the final output.
    
// 7. **EMOTION AND STICKER EMOTION:**
//     * You MUST use relevant **Emojis** (sticker emotion) in your responses to maintain a friendly and engaging tone. For example, use a ☀️ for sunny weather or a 🤔 when asking a clarifying question.
// `;
// // ---------------------------------------------


// // --- 4. API CALL FUNCTION using SDK ---
// async function callGeminiApi(userQuery, history) {
//     // History को Gemini SDK के लिए सही प्रारूप में बदलें
//     const contents = history.map(msg => ({
//         role: msg.role === 'user' ? 'user' : 'model',
//         parts: msg.parts
//     }));

//     const config = {
//         tools: [{ googleSearch: {} }], 
//         systemInstruction: SYSTEM_INSTRUCTION,
//     };
    
//     // हर बार एक नया चैट सेशन (stateless) शुरू करें और पूरा इतिहास पास करें
//     const chat = ai.chats.create({ 
//         model: GEMINI_MODEL, 
//         history: contents, 
//         config: config
//     });
    
//     const result = await chat.sendMessage({ message: userQuery });
    
//     const botText = result.text;
//     let sources = [];

//     // Sources metadata निकालें
//     const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
//     if (groundingMetadata && groundingMetadata.groundingChunks) {
//         // डुप्लीकेट URI को हटाने के लिए Set का उपयोग करें
//         const uniqueSources = new Set();
//         sources = groundingMetadata.groundingChunks
//             .map(chunk => ({
//                 uri: chunk.web?.uri,
//                 title: chunk.web?.title,
//             }))
//             .filter(source => source.uri && source.title && !uniqueSources.has(source.uri) && uniqueSources.add(source.uri));
//     }
    
//     return { botText, sources };
// }


// // --- 5. CHAT ENDPOINT ---
// app.post('/api/chat', async (req, res) => {
//     const { message, history } = req.body;
    
//     if (!message) {
//         return res.status(400).json({ error: 'Message is required' });
//     }

//     try {
//         const response = await callGeminiApi(message, history || []);
        
//         console.log('Gemini Full Response:', response.botText); 
        
//         res.status(200).json(response); 

//     } catch (error) {
//         console.error('❌ Gemini API call failed:', error.message);
        
//         let clientStatus = 500;
//         let errorMsg = 'API call mein koi error hai: Internal Server Error.';

//         if (error.message.includes('API_KEY_INVALID') || error.message.includes('403') || error.message.includes('401')) {
//             clientStatus = 403; 
//             errorMsg = "API Access Denied (Status 403/401). कृपया अपनी GEMINI_API_KEY और Google Cloud पर Billing status की जाँच करें।"; 
//         }

//         res.status(clientStatus).json({ 
//             botText: errorMsg,
//             sources: [] 
//         });
//     }
// });

// // --- 6. HEALTH CHECK ---
// app.get('/', (req, res) => {
//     res.status(200).send({ status: 'Vision AI API is running and healthy.' });
// });

// // --- 7. SERVER START ---
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//     console.log("-----------------------------------------------------");
//     console.log(`✅ Server ready on port ${PORT}.`);
//     console.log("-----------------------------------------------------");
// });
// server.js (या index.js)

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
const allowedOrigins = ['https://ltslucky038-ai.github.io']; 

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
You are 'Vision', an AI Assistant specializing in real-time information and conversational AI...
// (यहां आपका पूरा SYSTEM_INSTRUCTION टेक्स्ट आएगा)
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