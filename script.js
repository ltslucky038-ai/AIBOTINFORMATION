
// ✅ FIX: URL से अनावश्यक स्पेस हटा दिया गया है
// const CHAT_API_ENDPOINT = 'https://aibotinformation.onrender.com/api/chat'; 

// // 💾 Global State & Memory
// let conversationHistory = []; 
// let currentUnit = 'celsius'; 
// let currentWeatherData = null; 

// // --- VOICE RECOGNITION GLOBAL STATE ---
// let recognitionInstance;
// let isRecording = false; 

// // --- DOM Elements ---
// const weatherContent = document.getElementById('weatherContent');
// const unitToggle = document.getElementById('unitToggle');
// const cityNameEl = document.getElementById('cityName');
// const temperatureEl = document.getElementById('temperature');
// const currentDateEl = document.getElementById('currentDate'); 
// const currentTimeEl = document.getElementById('currentTime'); 
// const descriptionEl = document.getElementById('description');
// const feelsLikeEl = document.getElementById('feelsLike');
// const humidityEl = document.getElementById('humidity');
// const windSpeedEl = document.getElementById('windSpeed');
// const pressureEl = document.getElementById('pressure');
// const aqiIndexEl = document.getElementById('aqiIndex');
// const uvIndexEl = document.getElementById('uvIndex');
// const aqiDescriptionEl = document.getElementById('aqiDescription');
// const uvAdviceEl = document.getElementById('uvAdvice');
// const weatherIconEl = document.getElementById('weatherIcon');
// const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
// const dailyForecastContainer = document.getElementById('dailyForecastContainer');
// const chatInput = document.getElementById('chatInput');
// const sendMessageButton = document.getElementById('sendMessageButton');
// const chatWindow = document.getElementById('chatWindow');
// const chatTypingIndicator = document.getElementById('chatTypingIndicator');
// const micButton = document.getElementById('micButton');
// const errorMsg = document.getElementById('errorMsg');


// // ======================================================================
// // === 2. VOICE RESPONSE (Text-to-Speech) ===
// // ======================================================================
// const speakBotResponse = (text, lang = 'hi-IN') => {
//     if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(text);
//         
//         const voices = window.speechSynthesis.getVoices();
//         let selectedVoice = voices.find(voice => voice.lang.startsWith(lang));
//         
//         if (selectedVoice) {
//             utterance.voice = selectedVoice;
//         } else {
//             utterance.lang = lang; 
//         }

//         window.speechSynthesis.cancel();
//         // अगर आप बॉट से बुलवाना चाहते हैं, तो नीचे वाली लाइन से '//' हटा दें
//         // window.speechSynthesis.speak(utterance); 
//     } else {
//         console.warn("Speech Synthesis not supported in this browser.");
//     }
// };

// // ======================================================================
// // === 3. VOICE INPUT LOGIC (CLICK-TO-TALK) ===
// // ======================================================================

// const startRecognition = () => {
//     if (!recognitionInstance || isRecording) return; 

//     isRecording = true;
//     if(micButton) micButton.classList.add('mic-active');
//     chatInput.placeholder = "Bol rahe hain... (Listening for your question...)";

//     try {
//         recognitionInstance.start();
//     } catch (e) {
//         if (e.name !== 'InvalidStateError') {
//             console.error("Error starting recognition:", e);
//             showMessage(`Error starting recognition: ${e.name}`, true);
//         }
//     }
// };

// const setupVoiceRecognition = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//         if(micButton) micButton.style.display = 'none';
//         console.warn("Web Speech API not supported in this browser.");
//         return;
//     }

//     const recognition = new webkitSpeechRecognition();
//     recognitionInstance = recognition;
//     
//     recognition.continuous = false; 
//     recognition.interimResults = false;
//     recognition.lang = 'hi-IN'; 
//     
//     recognition.onresult = (event) => {
//         const finalResults = event.results[event.results.length - 1];
//         if (!finalResults.isFinal) return;
//         
//         const transcript = finalResults[0].transcript;

//         chatInput.value = transcript;
//         handleChatSubmit(); 
//     };

//     recognition.onerror = (event) => {
//         console.error('Speech Recognition Error:', event.error);
//         showMessage(`Voice input error: ${event.error}. Please ensure microphone access is granted.`, true);
//         
//         isRecording = false;
//         if(micButton) micButton.classList.remove('mic-active');
//         chatInput.placeholder = "Aap kya jaanna chahte hain?";
//     };

//     recognition.onend = () => {
//         isRecording = false;
//         if(micButton) micButton.classList.remove('mic-active');
//         chatInput.placeholder = "Aap kya jaanna chahte hain?";
//     };
// };


// // ======================================================================
// // === 4. UI Update Functions ===
// // ======================================================================

// const getAqiDescription = (aqiIndex) => {
//     const index = parseInt(aqiIndex);
//     if (isNaN(index)) return { description: 'N/A', classes: 'bg-gray-500 text-white' };

//     if (index <= 50) return { description: 'Good (Accha)', classes: 'bg-green-500 text-white' };
//     if (index <= 100) return { description: 'Moderate (Theek)', classes: 'bg-yellow-500 text-gray-900' };
//     if (index <= 150) return { description: 'Unhealthy for Sensitive Groups (Nuksaandeh)', classes: 'bg-orange-500 text-white' };
//     if (index <= 200) return { description: 'Unhealthy (Kharab)', classes: 'bg-red-500 text-white' };
//     if (index <= 300) return { description: 'Very Unhealthy (Bahut Kharab)', classes: 'bg-purple-600 text-white' };
//     return { description: 'Hazardous (Khatarnaak)', classes: 'bg-maroon-700 text-white' };
// };

// const getUVAdvice = (uvIndex) => {
//     const index = parseFloat(uvIndex);
//     if (isNaN(index)) return 'UV data not available.';

//     if (index <= 2) return 'Low: Protection not needed.';
//     if (index <= 5) return 'Moderate: Wear sun protection.';
//     if (index <= 7) return 'High: Seek shade and wear protection.';
//     if (index <= 10) return 'Very High: Avoid midday sun.';
//     return 'Extreme: Take all precautions.';
// };

// const updateClock = () => {
//     const now = new Date();
//     const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//     const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }; 

//     if (currentDateEl) currentDateEl.textContent = now.toLocaleDateString(undefined, dateOptions);
//     if (currentTimeEl) currentTimeEl.textContent = now.toLocaleTimeString(undefined, timeOptions);
// };

// const formatTemperature = (tempBase, unitSymbol) => {
//     let displayTemp;
//     const baseTempCelsius = parseFloat(tempBase);

//     const isCelsiusInput = !unitSymbol || unitSymbol.includes('C');
//     let tempC = isCelsiusInput ? baseTempCelsius : (baseTempCelsius - 32) * 5/9;
//     
//     if (isNaN(tempC)) return 'N/A'; 

//     if (currentUnit === 'celsius') {
//         displayTemp = tempC;
//         unitSymbol = '°C';
//     } else {
//         displayTemp = (tempC * 9/5) + 32;
//         unitSymbol = '°F';
//     }
//     return `${displayTemp.toFixed(0)}${unitSymbol}`; 
// };

// const getWeatherIconName = (description) => {
//     const desc = description.toLowerCase();
//     if (desc.includes('sun') || desc.includes('clear')) return { icon: 'sun' };
//     if (desc.includes('cloud') || desc.includes('overcast')) return { icon: 'cloud' };
//     if (desc.includes('rain') || desc.includes('drizzle')) return { icon: 'cloud-rain' };
//     if (desc.includes('thunder') || desc.includes('storm')) return { icon: 'cloud-lightning' };
//     if (desc.includes('snow') || desc.includes('freezing')) return { icon: 'snowflake' };
//     if (desc.includes('mist') || desc.includes('haze') || desc.includes('fog')) return { icon: 'cloud-fog' };
//     if (desc.includes('partly')) return { icon: 'cloud-sun' };
//     return { icon: 'thermometer' }; 
// };

// const showMessage = (message, isError = true) => {
//     if (!errorMsg) return;
//     errorMsg.textContent = message;
//     errorMsg.classList.toggle('hidden', !message);
//     errorMsg.classList.toggle('text-red-400', isError);
//     errorMsg.classList.toggle('text-green-400', !isError);
// };

// const clearWeatherUI = () => {
//     weatherContent.classList.add('hidden'); 
//     currentWeatherData = null;

//     cityNameEl.textContent = '...';
//     temperatureEl.textContent = '...';
//     descriptionEl.textContent = '...';
//     feelsLikeEl.textContent = '...';
//     
//     aqiDescriptionEl.textContent = '...';
//     aqiDescriptionEl.className = 'aqi-pill bg-gray-500 text-white';
//     uvAdviceEl.textContent = '';
//     
//     hourlyForecastContainer.innerHTML = '<p id="hourlyPlaceholder" class="text-gray-500 text-center w-full">Data not available yet.</p>';
//     dailyForecastContainer.innerHTML = '<p id="dailyPlaceholder" class="text-gray-500 text-center w-full">Data not available yet.</p>';
//     showMessage("");
// };

// const updateWeatherUI = (data) => {
//     if (!data) {
//         clearWeatherUI();
//         return;
//     }
//     
//     cityNameEl.textContent = data.city || 'Location Unknown';
//     temperatureEl.textContent = formatTemperature(data.temp.current, data.temp.unit);
//     descriptionEl.textContent = data.description || 'N/A';

//     const feelsLikeDisplay = data.temp.feelsLike !== 'N/A' 
//         ? data.temp.feelsLike 
//         : data.temp.current;
//         
//     feelsLikeEl.textContent = formatTemperature(feelsLikeDisplay, data.temp.unit);

//     const iconData = getWeatherIconName(data.description || '');
//     weatherIconEl.innerHTML = `<i data-lucide="${iconData.icon}" class="text-white" style="width: 6rem; height: 6rem;"></i>`;

//     // ✅ FIX: .trim() ensure no extra space or character is included
//     humidityEl.textContent = (data.details.humidity || 'N/A').trim();
//     windSpeedEl.textContent = (data.details.windSpeed || 'N/A').trim();
//     pressureEl.textContent = (data.details.pressure || 'N/A').trim();
//     
//     const aqiInfo = getAqiDescription(data.details.aqiIndex || 'N/A');
//     aqiIndexEl.textContent = (data.details.aqiIndex || 'N/A').trim();
//     aqiDescriptionEl.textContent = (data.details.aqi || aqiInfo.description).trim(); // Use parsed AQI description first
//     aqiDescriptionEl.className = `aqi-pill text-xs mt-1 p-0.5 rounded ${aqiInfo.classes}`;
//     
//     uvIndexEl.textContent = (data.details.uvIndex || 'N/A').trim();
//     uvAdviceEl.textContent = getUVAdvice(data.details.uvIndex).trim();
//     
//     displayForecast(hourlyForecastContainer, data.forecasts.hourly, true, data.temp.unit);
//     displayForecast(dailyForecastContainer, data.forecasts.daily, false, data.temp.unit);
//     weatherContent.classList.remove('hidden');
//     if (typeof lucide !== 'undefined' && lucide.createIcons) {
//         lucide.createIcons();
//     }
// };

// const displayForecast = (container, forecastArray, isHourly, tempUnit) => {
//     container.innerHTML = '';
//     if (!forecastArray || forecastArray.length === 0) {
//         container.innerHTML = `<p class="text-gray-500 text-center w-full">Forecast data N/A.</p>`;
//         return;
//     }

//     forecastArray.forEach(item => {
//         const timeOrDay = isHourly ? item.time : item.day;
//         const tempDisplay = isHourly 
//             ? formatTemperature(item.temp, tempUnit)
//             : `${formatTemperature(item.tempMax, tempUnit)} / ${formatTemperature(item.tempMin, tempUnit)}`;
//         const iconData = getWeatherIconName(item.description);
//         const card = document.createElement('div');
//         card.className = `p-3 rounded-xl shadow-lg text-center transition duration-300 hover:bg-gray-600 flex-shrink-0 ${isHourly ? 'forecast-card w-24' : 'daily-card w-24'}`; 
//         card.innerHTML = `
//             <p class="text-sm font-medium text-indigo-300">${timeOrDay}</p>
//             <div class="text-3xl my-1"><i data-lucide="${iconData.icon}" class="mx-auto" style="width: 32px; height: 32px;"></i></div>
//             <p class="${isHourly ? 'text-lg font-bold' : 'text-base font-bold'}">${tempDisplay}</p>
//             ${!isHourly ? `<p class="text-xs text-gray-400 mt-0.5">${item.description.split(' ')[0]}</p>` : ''}
//         `;
//         container.appendChild(card);
//     });
//     if (typeof lucide !== 'undefined' && lucide.createIcons) {
//         lucide.createIcons();
//     }
// };

// function renderMarkdown(markdownText) {
//     let html = markdownText;
//     html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
//     html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
//     html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
//     html = html.replace(/_(.*?)_/g, '<em>$1</em>');
//     html = html.replace(/\n/g, '<br>');
//     return html;
// }

// const appendMessage = (text, type, sources = []) => {
//     const wrapper = document.createElement('div');
//     wrapper.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;
//     const bubble = document.createElement('div');
//     const baseClasses = 'max-w-xs md:max-w-md p-3 shadow-lg transition-all duration-300 opacity-0 transform translate-y-2 text-sm';
//     if (type === 'user') {
//         bubble.className = `${baseClasses} user-message-bubble-custom text-sm`;
//         bubble.textContent = text;
//     } else {
//         const htmlText = renderMarkdown(text);
//         bubble.innerHTML = htmlText;
//         bubble.className = `${baseClasses} bot-message-bubble-custom text-base`;
//     }
//     wrapper.appendChild(bubble);
//     chatWindow.appendChild(wrapper);

//     setTimeout(() => {
//         bubble.classList.remove('opacity-0', 'translate-y-2');
//     }, 50);
//     if (type === 'bot' && sources && sources.length > 0) {
//         const sourcesDiv = document.createElement('div');
//         sourcesDiv.className = 'mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2';
//         let sourceHtml = '<strong>Sources:</strong><ul>';
//         sources.slice(0, 3).forEach((src, index) => {
//             sourceHtml += `<li class="mt-1"><a href="${src.uri}" target="_blank" class="text-indigo-400 hover:text-indigo-200 underline block truncate" title="${src.title}">${index + 1}. ${src.title || src.uri}</a></li>`;
//         });
//         sourceHtml += '</ul>';
//         sourcesDiv.innerHTML = sourceHtml; 
//         bubble.appendChild(sourcesDiv);
//     }
//     chatWindow.scrollTop = chatWindow.scrollHeight;
// };
// // ======================================================================
// // === 5. WEATHER PARSING LOGIC (ROBUST VERSION) ===
// // ======================================================================
// const parseWeatherReport = (text) => {
//     const normalizedText = (text || '').toLowerCase(); 
//     if (!normalizedText.includes('weather') && 
//         !normalizedText.includes('details:') &&
//         !normalizedText.includes('temperature') &&
//         !normalizedText.includes('wind speed')) {
//         return null; 
//     }
//     
//     const data = {
//         city: 'N/A',
//         temp: { current: 'N/A', feelsLike: 'N/A', unit: '°C' },
//         description: 'N/A',
//         details: { humidity: 'N/A', windSpeed: 'N/A', pressure: 'N/A', aqiIndex: 'N/A', aqi: 'N/A', uvIndex: 'N/A' },
//         forecasts: { hourly: [], daily: [] }
//     };
//     
//     // --- 1. City Matching (Improved for Accuracy - FIX for N/A city name) ---
//     const cityMatch = text.match(/Weather\s*for\s*([A-Z][A-Za-z\s]+?)\s*(?:is|currently|\s*weather|$|\.)/i);

//     if (cityMatch && cityMatch[1]) {
//         let cityRaw = cityMatch[1];
//         
//         cityRaw = cityRaw.replace(/is\s*currently|currently|is|weather/i, '').trim();
//         cityRaw = cityRaw.replace(/[.,]$/g, ''); 
//         
//         data.city = cityRaw.replace(/zila|Jila|District/gi, '').trim(); 
//         
//         if (data.city === '') {
//             data.city = 'Location Unknown';
//         }
//     } else {
//         data.city = 'N/A';
//     }

//     // --- 2. Temperature Matching (Most robust for C or F) ---
//     const tempRegex = /(\d+\.?\d*)\s*(?:degrees|temp)?\s*(°C|°F|C|F)/i;
//     const tempMatch = text.match(tempRegex);

//     if (tempMatch) {
//         data.temp.current = tempMatch[1];
//         data.temp.unit = tempMatch[2].toUpperCase().includes('C') ? '°C' : '°F';
//     } else {
//         const bareTempMatch = text.match(/(\d+)\s*(?:is|and)\s*([A-Za-z\s]+)/i); 
//         if (bareTempMatch) {
//             data.temp.current = bareTempMatch[1];
//             data.temp.unit = '°C'; 
//         }
//     }

//     // --- 3. Description Matching (Flexible positions + Cleaning) ---
//     const descMatch = text.match(/and\s*([A-Za-z\s]+?)(?:\.|,|Details|\s*skies)/i) || 
//                       text.match(/(?:conditions|is)\s*([A-Za-z\s]+?)\s*(?:skies|Detail|\.)/i);

//     if (descMatch) {
//         let descriptionRaw = (descMatch[1] || '').trim().replace(/[.,]$/g, '');
//         descriptionRaw = descriptionRaw.replace(/साफ|बादल|बारिश|धूप|कोहरा|आसमान/g, '').trim();
//         if (descriptionRaw === '' || descriptionRaw.toLowerCase() === 'skies') {
//             data.description = 'N/A';
//         } else {
//             data.description = descriptionRaw;
//         }
//     }
//     
//     // --- 4. Details Matching (Handling missing spaces and commas) ---
//     // RegEx updated to be slightly more tolerant of formatting/markdown issues (though instructions should prevent them)
//     const detailsRegex = /Details\s*:\s*Humidity\s*:\s*([^*,]+?)\s*(?:%?)\s*(?:,|\s*Wind)/i;
//     const windRegex = /Wind\s*speed\s*:\s*([^*,]+?)\s*(?:km\/h)?\s*(?:,|\s*Pressure)/i;
//     const pressureRegex = /Pressure\s*:\s*([^*,]+?)\s*(?:hPa)?\s*(?:,|\s*UV)/i;
//     const uvRegex = /UV\s*Index\s*:\s*([^*,]+?)\s*(?:,|\s*Air)/i;
//     const aqiRegex = /Air\s*Quality\s*:\s*([^.]+)/i; 
//     
//     // Utility function to match and clean data
//     const getMatch = (regex) => {
//         const match = text.match(regex);
//         if (!match || !match[1]) return 'N/A';
//         return match[1].trim().replace(/\[|\]|%|hPa|km\/h|\./g, '');
//     };
//     
//     // Apply getMatch, trimming values to prevent ** issue (even though instructions forbid it)
//     data.details.humidity = getMatch(detailsRegex);
//     data.details.windSpeed = getMatch(windRegex);
//     data.details.pressure = getMatch(pressureRegex);
//     data.details.uvIndex = getMatch(uvRegex);
//     
//     // --- AQI Index & Description FIX ---
//     const aqiFull = getMatch(aqiRegex);
//     if (aqiFull !== 'N/A') {
//         const indexMatch = aqiFull.match(/\((\s*\d+)\s*\)/) || aqiFull.match(/(\s*\d+)/);
//         data.details.aqiIndex = indexMatch?.[1]?.trim() || 'N/A';

//         const descMatch = aqiFull.match(/^([A-Za-z\s]+?)\s*(?:\()/) || aqiFull.match(/^([A-Za-z\s]+)/);
//         data.details.aqi = descMatch?.[1]?.trim() || 'N/A';
//     }
//     
//     if (data.temp.current !== 'N/A' && data.temp.feelsLike === 'N/A') {
//         data.temp.feelsLike = data.temp.current; 
//     }
//     
//     // --- 5. Live Forecast Parsing ---
//     const parseForecast = (forecastType, textToParse) => {
//         const results = [];
//         const sectionMatch = textToParse.match(new RegExp(`${forecastType}\\s*Forecast\\s*:\\s*(.*)`, 'i'));
//         
//         if (!sectionMatch) return results;

//         const forecastText = sectionMatch[1]; 
//         
//         // RegEx for Daily: [Day, Max, Min, Description]
//         const dailyItemRegex = /\[([^\]]+?)\s*,\s*(\d+)\s*(?:°C|°F)?\s*,\s*(\d+)\s*(?:°C|°F)?\s*,\s*([^\]]+?)\]/gi; 
//         
//         // RegEx for Hourly: [Time, Temp, Description]
//         const hourlyItemRegex = /\[([^\]]+?)\s*,\s*(\d+)\s*(?:°C|°F)?\s*,\s*([^\]]+?)\]/gi;

//         let match;
//         if (forecastType.toLowerCase() === 'daily') {
//             while ((match = dailyItemRegex.exec(forecastText)) !== null) {
//                 results.push({
//                     day: match[1].trim(),
//                     tempMax: parseFloat(match[2]),
//                     tempMin: parseFloat(match[3]),
//                     description: match[4].trim()
//                 });
//             }
//         } else if (forecastType.toLowerCase() === 'hourly') {
//             while ((match = hourlyItemRegex.exec(forecastText)) !== null) {
//                 results.push({
//                     time: match[1].trim(),
//                     temp: parseFloat(match[2]),
//                     description: match[3].trim().replace(/\[|\]/g, '')
//                 });
//             }
//         }
//         return results;
//     };
//     
//     data.forecasts.hourly = parseForecast('Hourly', text);
//     data.forecasts.daily = parseForecast('Daily', text);

//     if (data.temp.current === 'N/A' && data.city === 'N/A') return null;
//     return data;
// };

// // ======================================================================
// // === 6. API Call Function & Chat Handler ===
// // ======================================================================
// async function callChatApi(userQuery, history) {
//     if (chatTypingIndicator) chatTypingIndicator.classList.remove('hidden');
//     try {
//         const response = await fetch(CHAT_API_ENDPOINT, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ 
//                 message: userQuery,
//                 history: history 
//             })
//         });

//         if (!response.ok) {
//             let errorDetails = `Server returned status ${response.status}.`;
//             const errorData = await response.json().catch(() => ({})); 
//             if (errorData.botText) {
//                 errorDetails = errorData.botText; 
//             } else if (response.status === 403 || response.status === 401) {
//                 errorDetails = 'API Access Denied (Status 403/401). कृपया **GEMINI_API_KEY** की जाँच करें।';
//             } else if (response.status === 500) {
//                  errorDetails = 'Internal Server Error (Status 500). Render server logs जाँच करें।';
//             }
//             throw new Error(`Connection Error: ${errorDetails}`);
//         }
//         
//         const data = await response.json(); 
//         if (chatTypingIndicator) chatTypingIndicator.classList.add('hidden');
//         return data; 
//     } catch (error) {
//         if (chatTypingIndicator) chatTypingIndicator.classList.add('hidden');
//         throw new Error(error.message);
//     }
// }

// const handleChatSubmit = async () => {
//     const userText = chatInput.value.trim();
//     if (userText === '') return;
//     clearWeatherUI(); 
    
//     // ✅ NEW FEATURE: Check for Chat Explanation Request 
//     const explainInChat = userText.toLowerCase().includes('explain') || 
//                           userText.toLowerCase().includes('yahin') ||
//                           userText.toLowerCase().includes('samjhao') ||
//                           userText.toLowerCase().includes('chat');

//     // 1. Display user message and add to history
//     appendMessage(userText, 'user');
//     conversationHistory.push({ role: "user", parts: [{ text: userText }] }); 

//     chatInput.value = '';
//     sendMessageButton.disabled = true;
//     if(micButton) micButton.disabled = true; 
//     chatInput.disabled = true;
    
//     try {
//         // 3. Call API and wait for response 
//         const responseData = await callChatApi(userText, conversationHistory);
        
//         const botText = responseData.botText || ''; 
//         const sources = responseData.sources || [];

//         // 4. Check for weather data
//         const weatherData = parseWeatherReport(botText); 
        
//         let responseToDisplay = botText;
        
//         if (weatherData) {
            
//             if (explainInChat) {
//                 // CASE A: User asked for explanation in chat (Show full botText)
//                 responseToDisplay = botText; // Gemini का पूरा, बिना-Markdown टेक्स्ट दिखाएँ
//                 showMessage(`Weather report displayed in chat as requested.`, false);
//                 // Weather Card को छिपा दें
//                 currentWeatherData = weatherData; 
//                 weatherContent.classList.add('hidden'); 
//             } else {
//                 // CASE B: Normal weather request (Show weather in card and small message in chat)
//                 responseToDisplay = "Mausam ki jaankari aur forecast uper dedicated weather card mein display ki gayi hai.";
//                 // Update the weather panel
//                 currentWeatherData = weatherData; 
//                 updateWeatherUI(weatherData); 
//                 showMessage(`Weather report successfully parsed for ${weatherData.city}.`, false);
//             }
            
//         } else {
//             // CASE C: Not a weather query (Show full botText)
//             showMessage(``, false);
//         }
        
//         // 5. Display the final response
//         appendMessage(responseToDisplay, 'bot', sources); 
//         // 6. Bot's full response added to history
//         conversationHistory.push({ role: "model", parts: [{ text: botText }] });
//     }
//      catch (error) {
//         console.error("Chat Error:", error);
//         const errorMessage = `An error occurred: ${error.message}`;
//         appendMessage(errorMessage, 'bot');
//         speakBotResponse("Server se connect nahi ho pa raha. Kripya check karein ki Node.js server chal raha hai.", 'hi-IN');
//         conversationHistory.pop(); 
//     }
//      finally {
//         sendMessageButton.disabled = false;
//         if(micButton) micButton.disabled = false; 
//         chatInput.disabled = false;
//         chatInput.focus();
//     }
// };


// // ======================================================================
// // === 7. Event Listeners and Initial Setup ===
// // ======================================================================

// if (micButton) {
//     micButton.addEventListener('click', () => {
//         if (isRecording) {
//             recognitionInstance.stop(); 
//         } else {
//             startRecognition(); 
//         }
//     });
// }

// unitToggle.addEventListener('click', () => {
//     if (currentUnit === 'celsius') {
//         currentUnit = 'fahrenheit';
//         unitToggle.textContent = 'Switch to °C';
//     } else {
//         currentUnit = 'celsius';
//         unitToggle.textContent = 'Switch to °F';
//     }
//     if (currentWeatherData) {
//         updateWeatherUI(currentWeatherData);
//     }
// });

// if (sendMessageButton && chatInput) {
//     sendMessageButton.addEventListener('click', handleChatSubmit);
//     chatInput.addEventListener('keypress', (event) => {
//         if (event.key === 'Enter') {
//             handleChatSubmit();
//         }
//     });
// }

// window.onload = () => {
//     updateClock();
//     setInterval(updateClock, 1000); 
//     if (typeof lucide !== 'undefined' && lucide.createIcons) {
//         lucide.createIcons();
//     } 
//     setupVoiceRecognition(); 
//     clearWeatherUI();
//     if (chatWindow) {
//         const welcomeMessage = `Namaste! Main aapka AI Assistant Vision hoon. Microphone button par click karke bol sakte hain ya phir type karein.`;
//         appendMessage(welcomeMessage, 'bot');
//     }
// };
// ✅ FIX: URL से अनावश्यक स्पेस हटा दिया गया है
const CHAT_API_ENDPOINT = 'https://aibotinformation.onrender.com/api/chat'; 

// // 💾 Global State & Memory
let conversationHistory = []; 
let currentUnit = 'celsius'; 
let currentWeatherData = null; 

// // --- VOICE RECOGNITION GLOBAL STATE ---
let recognitionInstance;
let isRecording = false; 

// // --- DOM Elements ---
const weatherContent = document.getElementById('weatherContent');
const unitToggle = document.getElementById('unitToggle');
const cityNameEl = document.getElementById('cityName');
const temperatureEl = document.getElementById('temperature');
const currentDateEl = document.getElementById('currentDate'); 
const currentTimeEl = document.getElementById('currentTime'); 
const descriptionEl = document.getElementById('description');
const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const pressureEl = document.getElementById('pressure');
const aqiIndexEl = document.getElementById('aqiIndex');
const uvIndexEl = document.getElementById('uvIndex');
const aqiDescriptionEl = document.getElementById('aqiDescription');
const uvAdviceEl = document.getElementById('uvAdvice');
const weatherIconEl = document.getElementById('weatherIcon');
const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
const dailyForecastContainer = document.getElementById('dailyForecastContainer');
const chatInput = document.getElementById('chatInput');
const sendMessageButton = document.getElementById('sendMessageButton');
const chatWindow = document.getElementById('chatWindow');
const chatTypingIndicator = document.getElementById('chatTypingIndicator');
const micButton = document.getElementById('micButton');
const errorMsg = document.getElementById('errorMsg');


// ======================================================================
// === 2. VOICE RESPONSE (Text-to-Speech) - Unchanged for simplicity ===
// ======================================================================
const speakBotResponse = (text, lang = 'hi-IN') => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = window.speechSynthesis.getVoices();
        let selectedVoice = voices.find(voice => voice.lang.startsWith(lang));
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        } else {
            utterance.lang = lang; 
        }

        window.speechSynthesis.cancel();
        // अगर आप बॉट से बुलवाना चाहते हैं, तो नीचे वाली लाइन से '//' हटा दें
        // window.speechSynthesis.speak(utterance); 
    } else {
        console.warn("Speech Synthesis not supported in this browser.");
    }
};

// ======================================================================
// === 3. VOICE INPUT LOGIC (CLICK-TO-TALK) ===
// ======================================================================

const startRecognition = () => {
    if (!recognitionInstance || isRecording || !micButton) return; // ✅ FIX: Check micButton existence

    isRecording = true;
    micButton.classList.add('mic-active');
    if(chatInput) chatInput.placeholder = "Bol rahe hain... (Listening for your question...)";

    try {
        recognitionInstance.start();
    } catch (e) {
        if (e.name !== 'InvalidStateError') {
            console.error("Error starting recognition:", e);
            showMessage(`Error starting recognition: ${e.name}`, true);
        }
    }
};

const setupVoiceRecognition = () => {
    // ✅ FIX: Check for the feature before proceeding
    if (!('webkitSpeechRecognition' in window)) {
        if(micButton) micButton.style.display = 'none';
        console.warn("Web Speech API not supported in this browser.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognitionInstance = recognition;
    
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; 
    
    recognition.onresult = (event) => {
        const finalResults = event.results[event.results.length - 1];
        if (!finalResults.isFinal) return;
        
        const transcript = finalResults[0].transcript;

        if(chatInput) chatInput.value = transcript;
        handleChatSubmit(); 
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        showMessage(`Voice input error: ${event.error}. Please ensure microphone access is granted.`, true);
        
        isRecording = false;
        if(micButton) micButton.classList.remove('mic-active');
        if(chatInput) chatInput.placeholder = "Aap kya jaanna chahte hain?";
    };

    recognition.onend = () => {
        isRecording = false;
        if(micButton) micButton.classList.remove('mic-active');
        if(chatInput) chatInput.placeholder = "Aap kya jaanna chahte hain?";
    };
};


// ======================================================================
// === 4. UI Update Functions ===
// ======================================================================

const getAqiDescription = (aqiIndex) => {
    const index = parseInt(aqiIndex);
    if (isNaN(index)) return { description: 'N/A', classes: 'bg-gray-500 text-white' };

    if (index <= 50) return { description: 'Good (Accha)', classes: 'bg-green-500 text-white' };
    if (index <= 100) return { description: 'Moderate (Theek)', classes: 'bg-yellow-500 text-gray-900' };
    if (index <= 150) return { description: 'Unhealthy for Sensitive Groups (Nuksaandeh)', classes: 'bg-orange-500 text-white' };
    if (index <= 200) return { description: 'Unhealthy (Kharab)', classes: 'bg-red-500 text-white' };
    if (index <= 300) return { description: 'Very Unhealthy (Bahut Kharab)', classes: 'bg-purple-600 text-white' };
    return { description: 'Hazardous (Khatarnaak)', classes: 'bg-maroon-700 text-white' };
};

const getUVAdvice = (uvIndex) => {
    const index = parseFloat(uvIndex);
    if (isNaN(index)) return 'UV data not available.';

    if (index <= 2) return 'Low: Protection not needed.';
    if (index <= 5) return 'Moderate: Wear sun protection.';
    if (index <= 7) return 'High: Seek shade and wear protection.';
    if (index <= 10) return 'Very High: Avoid midday sun.';
    return 'Extreme: Take all precautions.';
};

const updateClock = () => {
    const now = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true }; 

    // ✅ FIX: Added DOM checks
    if (currentDateEl) currentDateEl.textContent = now.toLocaleDateString(undefined, dateOptions);
    if (currentTimeEl) currentTimeEl.textContent = now.toLocaleTimeString(undefined, timeOptions);
};

const formatTemperature = (tempBase, unitSymbol) => {
    let displayTemp;
    const baseTemp = parseFloat(tempBase);

    if (isNaN(baseTemp)) return 'N/A'; 

    // API might return temperature in °C or °F, but the internal format for calculation 
    // in this function assumes the input is in Celsius if the unit is missing or 'C'.
    const isCelsiusInput = !unitSymbol || unitSymbol.includes('C');
    let tempC = isCelsiusInput ? baseTemp : (baseTemp - 32) * 5/9;
    
    if (currentUnit === 'celsius') {
        displayTemp = tempC;
        unitSymbol = '°C';
    } else {
        displayTemp = (tempC * 9/5) + 32;
        unitSymbol = '°F';
    }
    return `${displayTemp.toFixed(0)}${unitSymbol}`; 
};

const getWeatherIconName = (description) => {
    const desc = (description || '').toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return { icon: 'sun' };
    if (desc.includes('cloud') || desc.includes('overcast')) return { icon: 'cloud' };
    if (desc.includes('rain') || desc.includes('drizzle')) return { icon: 'cloud-rain' };
    if (desc.includes('thunder') || desc.includes('storm')) return { icon: 'cloud-lightning' };
    if (desc.includes('snow') || desc.includes('freezing')) return { icon: 'snowflake' };
    if (desc.includes('mist') || desc.includes('haze') || desc.includes('fog')) return { icon: 'cloud-fog' };
    if (desc.includes('partly')) return { icon: 'cloud-sun' };
    return { icon: 'thermometer' }; 
};

const showMessage = (message, isError = true) => {
    if (!errorMsg) return;
    errorMsg.textContent = message;
    errorMsg.classList.toggle('hidden', !message);
    errorMsg.classList.toggle('text-red-400', isError);
    errorMsg.classList.toggle('text-green-400', !isError);
};

const clearWeatherUI = () => {
    if(weatherContent) weatherContent.classList.add('hidden'); 
    currentWeatherData = null;

    if(cityNameEl) cityNameEl.textContent = '...';
    if(temperatureEl) temperatureEl.textContent = '...';
    if(descriptionEl) descriptionEl.textContent = '...';
    if(feelsLikeEl) feelsLikeEl.textContent = '...';
    
    if(aqiDescriptionEl) {
        aqiDescriptionEl.textContent = '...';
        aqiDescriptionEl.className = 'aqi-pill bg-gray-500 text-white';
    }
    if(uvAdviceEl) uvAdviceEl.textContent = '';
    
    if(hourlyForecastContainer) hourlyForecastContainer.innerHTML = '<p id="hourlyPlaceholder" class="text-gray-500 text-center w-full">Data not available yet.</p>';
    if(dailyForecastContainer) dailyForecastContainer.innerHTML = '<p id="dailyPlaceholder" class="text-gray-500 text-center w-full">Data not available yet.</p>';
    showMessage("");
};

const updateWeatherUI = (data) => {
    // ✅ FIX: Check for essential elements
    if (!data || !cityNameEl || !temperatureEl || !weatherIconEl || !weatherContent) {
        clearWeatherUI();
        return;
    }
    
    cityNameEl.textContent = data.city || 'Location Unknown';
    temperatureEl.textContent = formatTemperature(data.temp.current, data.temp.unit);
    if(descriptionEl) descriptionEl.textContent = data.description || 'N/A';

    const feelsLikeDisplay = data.temp.feelsLike !== 'N/A' 
        ? data.temp.feelsLike 
        : data.temp.current;
        
    if(feelsLikeEl) feelsLikeEl.textContent = formatTemperature(feelsLikeDisplay, data.temp.unit);

    const iconData = getWeatherIconName(data.description || '');
    weatherIconEl.innerHTML = `<i data-lucide="${iconData.icon}" class="text-white" style="width: 6rem; height: 6rem;"></i>`;

    // ✅ FIX: Use optional chaining or check to prevent errors
    if(humidityEl) humidityEl.textContent = (data.details.humidity || 'N/A').trim();
    if(windSpeedEl) windSpeedEl.textContent = (data.details.windSpeed || 'N/A').trim();
    if(pressureEl) pressureEl.textContent = (data.details.pressure || 'N/A').trim();
    
    const aqiInfo = getAqiDescription(data.details.aqiIndex || 'N/A');

    if(aqiIndexEl) aqiIndexEl.textContent = (data.details.aqiIndex || 'N/A').trim();
    if(aqiDescriptionEl) {
        aqiDescriptionEl.textContent = (data.details.aqi || aqiInfo.description).trim(); 
        aqiDescriptionEl.className = `aqi-pill text-xs mt-1 p-0.5 rounded ${aqiInfo.classes}`;
    }
    
    if(uvIndexEl) uvIndexEl.textContent = (data.details.uvIndex || 'N/A').trim();
    if(uvAdviceEl) uvAdviceEl.textContent = getUVAdvice(data.details.uvIndex).trim();
    
    if(hourlyForecastContainer) displayForecast(hourlyForecastContainer, data.forecasts.hourly, true, data.temp.unit);
    if(dailyForecastContainer) displayForecast(dailyForecastContainer, data.forecasts.daily, false, data.temp.unit);
    weatherContent.classList.remove('hidden');

    // ✅ FIX: Re-initialize Lucide Icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

const displayForecast = (container, forecastArray, isHourly, tempUnit) => {
    // ✅ FIX: Check container existence
    if (!container) return;
    
    container.innerHTML = '';
    if (!forecastArray || forecastArray.length === 0) {
        container.innerHTML = `<p class="text-gray-500 text-center w-full">Forecast data N/A.</p>`;
        return;
    }

    forecastArray.forEach(item => {
        const timeOrDay = isHourly ? item.time : item.day;
        const tempDisplay = isHourly 
            ? formatTemperature(item.temp, tempUnit)
            : `${formatTemperature(item.tempMax, tempUnit)} / ${formatTemperature(item.tempMin, tempUnit)}`;
        const iconData = getWeatherIconName(item.description);
        const card = document.createElement('div');
        card.className = `p-3 rounded-xl shadow-lg text-center transition duration-300 hover:bg-gray-600 flex-shrink-0 ${isHourly ? 'forecast-card w-24' : 'daily-card w-24'}`; 
        card.innerHTML = `
            <p class="text-sm font-medium text-indigo-300">${timeOrDay}</p>
            <div class="text-3xl my-1"><i data-lucide="${iconData.icon}" class="mx-auto" style="width: 32px; height: 32px;"></i></div>
            <p class="${isHourly ? 'text-lg font-bold' : 'text-base font-bold'}">${tempDisplay}</p>
            ${!isHourly ? `<p class="text-xs text-gray-400 mt-0.5">${item.description.split(' ')[0]}</p>` : ''}
        `;
        container.appendChild(card);
    });
    // ✅ FIX: Re-initialize Lucide Icons after adding new elements
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

function renderMarkdown(markdownText) {
    let html = markdownText;
    // Bold: **...** or __...__
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    // Emphasis: *...* or _..._
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    // Newline to <br>
    html = html.replace(/\n/g, '<br>');
    return html;
}

const appendMessage = (text, type, sources = []) => {
    if (!chatWindow) return; // ✅ FIX: Check chatWindow existence
    
    const wrapper = document.createElement('div');
    wrapper.className = `flex ${type === 'user' ? 'justify-end' : 'justify-start'}`;
    const bubble = document.createElement('div');
    const baseClasses = 'max-w-xs md:max-w-md p-3 shadow-lg transition-all duration-300 opacity-0 transform translate-y-2 text-sm';
    if (type === 'user') {
        bubble.className = `${baseClasses} user-message-bubble-custom text-sm`;
        bubble.textContent = text;
    } else {
        const htmlText = renderMarkdown(text);
        bubble.innerHTML = htmlText;
        bubble.className = `${baseClasses} bot-message-bubble-custom text-base`;
    }
    wrapper.appendChild(bubble);
    chatWindow.appendChild(wrapper);

    setTimeout(() => {
        bubble.classList.remove('opacity-0', 'translate-y-2');
    }, 50);
    
    if (type === 'bot' && sources && sources.length > 0) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'mt-2 text-xs text-gray-400 border-t border-gray-600 pt-2';
        let sourceHtml = '<strong>Sources:</strong><ul>';
        sources.slice(0, 3).forEach((src, index) => {
            // Added check for valid URI
            const uri = src.uri && src.uri.startsWith('http') ? src.uri : '#';
            sourceHtml += `<li class="mt-1"><a href="${uri}" target="_blank" class="text-indigo-400 hover:text-indigo-200 underline block truncate" title="${src.title || src.uri}">${index + 1}. ${src.title || src.uri || 'Link'}</a></li>`;
        });
        sourceHtml += '</ul>';
        sourcesDiv.innerHTML = sourceHtml; 
        bubble.appendChild(sourcesDiv);
    }
    chatWindow.scrollTop = chatWindow.scrollHeight;
};
// ======================================================================
// === 5. WEATHER PARSING LOGIC (ROBUST VERSION) ===
// ======================================================================
const parseWeatherReport = (text) => {
    const normalizedText = (text || '').toLowerCase(); 
    if (!normalizedText.includes('weather') && 
        !normalizedText.includes('details:') &&
        !normalizedText.includes('temperature') &&
        !normalizedText.includes('wind speed')) {
        return null; 
    }
    
    const data = {
        city: 'N/A',
        temp: { current: 'N/A', feelsLike: 'N/A', unit: '°C' },
        description: 'N/A',
        details: { humidity: 'N/A', windSpeed: 'N/A', pressure: 'N/A', aqiIndex: 'N/A', aqi: 'N/A', uvIndex: 'N/A' },
        forecasts: { hourly: [], daily: [] }
    };
    
    // --- 1. City Matching (Improved for Accuracy) ---
    const cityMatch = text.match(/Weather\s*for\s*(.*?)\s*(?:is|currently|\s*weather|$|\.|Detail|Temp)/i);

    if (cityMatch && cityMatch[1]) {
        let cityRaw = cityMatch[1].trim();
        cityRaw = cityRaw.replace(/is\s*currently|currently|is|weather/i, '').trim();
        cityRaw = cityRaw.replace(/[.,:;]$/g, ''); // Remove trailing punctuation
        cityRaw = cityRaw.replace(/zila|Jila|District/gi, '').trim(); 
        data.city = cityRaw || 'Location Unknown';
    } else {
        data.city = 'N/A';
    }

    // --- 2. Temperature Matching (Most robust for C or F) ---
    // Looks for a number followed by degree/temp or C/F
    const tempRegex = /(\d+\.?\d*)\s*(?:degrees?|temp)?\s*(?:°C|°F|C|F|celsius|fahrenheit|temp)?/i;
    const tempMatch = text.match(tempRegex);

    if (tempMatch) {
        data.temp.current = tempMatch[1];
        // Try to determine unit by looking for C/F near the number
        const unitMatch = text.substring(tempMatch.index).match(/(°C|°F|C|F|celsius|fahrenheit)/i);
        data.temp.unit = unitMatch && unitMatch[1].toUpperCase().includes('F') ? '°F' : '°C';
    }

    // --- 3. Description Matching (More targeted) ---
    const descMatch = text.match(/(?:conditions\s*are|is|and)\s*([A-Za-z\s]+?)\s*(?:skies|Detail|\.)/i);

    if (descMatch) {
        let descriptionRaw = (descMatch[1] || '').trim().replace(/[.,:;]$/g, '');
        // Clean up Hindi words that might interfere
        descriptionRaw = descriptionRaw.replace(/साफ|बादल|बारिश|धूप|कोहरा|आसमान/g, '').trim();
        if (descriptionRaw.toLowerCase() === 'skies' || descriptionRaw === '') {
            data.description = 'N/A';
        } else {
            data.description = descriptionRaw;
        }
    }
    
    // --- 4. Details Matching (Handling missing spaces and commas) ---
    // RegEx updated to be slightly more tolerant of formatting/markdown issues
    const detailsRegex = /Details\s*:\s*Humidity\s*:\s*([^*,]+?)\s*(?:%?)\s*(?:,|\s*Wind)/i;
    const windRegex = /Wind\s*speed\s*:\s*([^*,]+?)\s*(?:km\/h|m\/s)?\s*(?:,|\s*Pressure)/i;
    const pressureRegex = /Pressure\s*:\s*([^*,]+?)\s*(?:hPa|mbar)?\s*(?:,|\s*UV)/i;
    const uvRegex = /UV\s*Index\s*:\s*([^*,]+?)\s*(?:,|\s*Air)/i;
    const aqiRegex = /Air\s*Quality\s*:\s*([^.]+)/i; 
    
    // Utility function to match and clean data
    const getMatch = (regex) => {
        const match = text.match(regex);
        if (!match || !match[1]) return 'N/A';
        // Clean up brackets and units
        return match[1].trim().replace(/\[|\]|%|hPa|km\/h|m\/s|mbar|\./g, '').trim();
    };
    
    // Apply getMatch
    data.details.humidity = getMatch(detailsRegex);
    data.details.windSpeed = getMatch(windRegex);
    data.details.pressure = getMatch(pressureRegex);
    data.details.uvIndex = getMatch(uvRegex);
    
    // --- AQI Index & Description FIX ---
    const aqiFull = getMatch(aqiRegex);
    if (aqiFull !== 'N/A') {
        // Match the number in parenthesis or at the start
        const indexMatch = aqiFull.match(/\((\s*\d+)\s*\)/) || aqiFull.match(/(\s*\d+)/);
        data.details.aqiIndex = indexMatch?.[1]?.trim() || 'N/A';

        // Match the text before the number
        const descMatch = aqiFull.match(/^([A-Za-z\s]+?)\s*(?:\()/);
        if (descMatch) {
            data.details.aqi = descMatch[1].trim() || 'N/A';
        } else {
            // Fallback to entire text if no parenthesis, then remove index
            data.details.aqi = aqiFull.replace(data.details.aqiIndex, '').trim().replace(/[\(\)]/g, '') || 'N/A';
        }
    }
    
    if (data.temp.current !== 'N/A' && data.temp.feelsLike === 'N/A') {
        data.temp.feelsLike = data.temp.current; 
    }
    
    // --- 5. Live Forecast Parsing ---
    const parseForecast = (forecastType, textToParse) => {
        const results = [];
        const sectionMatch = textToParse.match(new RegExp(`${forecastType}\\s*Forecast\\s*:\\s*(.*)`, 'i'));
        
        if (!sectionMatch) return results;

        const forecastText = sectionMatch[1]; 
        
        // RegEx for Daily: [Day, Max, Min, Description]
        const dailyItemRegex = /\[([^\]]+?)\s*,\s*(\d+\.?\d*)\s*(?:°C|°F)?\s*,\s*(\d+\.?\d*)\s*(?:°C|°F)?\s*,\s*([^\]]+?)\]/gi; 
        
        // RegEx for Hourly: [Time, Temp, Description]
        const hourlyItemRegex = /\[([^\]]+?)\s*,\s*(\d+\.?\d*)\s*(?:°C|°F)?\s*,\s*([^\]]+?)\]/gi;

        let match;
        if (forecastType.toLowerCase() === 'daily') {
            while ((match = dailyItemRegex.exec(forecastText)) !== null) {
                results.push({
                    day: match[1].trim(),
                    tempMax: parseFloat(match[2]),
                    tempMin: parseFloat(match[3]),
                    description: match[4].trim().replace(/[\(\)]/g, '') // Clean up description
                });
            }
        } else if (forecastType.toLowerCase() === 'hourly') {
            while ((match = hourlyItemRegex.exec(forecastText)) !== null) {
                results.push({
                    time: match[1].trim(),
                    temp: parseFloat(match[2]),
                    description: match[3].trim().replace(/[\(\)]/g, '')
                });
            }
        }
        return results;
    };
    
    data.forecasts.hourly = parseForecast('Hourly', text);
    data.forecasts.daily = parseForecast('Daily', text);

    if (data.temp.current === 'N/A' && data.city === 'N/A') return null;
    return data;
};

// ======================================================================
// === 6. API Call Function & Chat Handler ===
// ======================================================================
async function callChatApi(userQuery, history) {
    if (chatTypingIndicator) chatTypingIndicator.classList.remove('hidden');
    try {
        const response = await fetch(CHAT_API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: userQuery,
                history: history 
            })
        });

        if (!response.ok) {
            let errorDetails = `Server returned status ${response.status}.`;
            const errorText = await response.text(); // Read text for better error message
            
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.botText) {
                    errorDetails = errorData.botText; 
                }
            } catch (e) {
                // Not JSON, use plain text error
                errorDetails = `API returned non-JSON error: ${errorText.substring(0, 100)}...`;
            }

            if (response.status === 403 || response.status === 401) {
                errorDetails = 'API Access Denied (Status 403/401). कृपया **GEMINI_API_KEY** की जाँच करें।';
            } else if (response.status === 500) {
                errorDetails = 'Internal Server Error (Status 500). Render server logs जाँच करें।';
            }
            throw new Error(`Connection Error: ${errorDetails}`);
        }
        
        const data = await response.json(); 
        if (chatTypingIndicator) chatTypingIndicator.classList.add('hidden');
        return data; 
    } catch (error) {
        if (chatTypingIndicator) chatTypingIndicator.classList.add('hidden');
        // Check for network error type
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Network Error: Server se connect nahi ho pa raha. Kripya check karein ki Node.js server chal raha hai aur URL sahi hai.');
        }
        throw new Error(error.message);
    }
}

const handleChatSubmit = async () => {
    if(!chatInput) return; // ✅ FIX: Check input existence

    const userText = chatInput.value.trim();
    if (userText === '') return;
    
    if (weatherContent) clearWeatherUI(); 
    
    // ✅ NEW FEATURE: Check for Chat Explanation Request 
    const explainInChat = userText.toLowerCase().includes('explain') || 
                          userText.toLowerCase().includes('yahin') ||
                          userText.toLowerCase().includes('samjhao') ||
                          userText.toLowerCase().includes('chat');

    // 1. Display user message and add to history
    appendMessage(userText, 'user');
    conversationHistory.push({ role: "user", parts: [{ text: userText }] }); 

    chatInput.value = '';
    if(sendMessageButton) sendMessageButton.disabled = true;
    if(micButton) micButton.disabled = true; 
    chatInput.disabled = true;
    
    try {
        // 3. Call API and wait for response 
        const responseData = await callChatApi(userText, conversationHistory);
        
        const botText = responseData.botText || ''; 
        const sources = responseData.sources || [];

        // 4. Check for weather data
        const weatherData = parseWeatherReport(botText); 
        
        let responseToDisplay = botText;
        
        if (weatherData) {
            
            if (explainInChat) {
                // CASE A: User asked for explanation in chat (Show full botText)
                responseToDisplay = botText; 
                showMessage(`Weather report displayed in chat as requested.`, false);
                // Weather Card को छिपा दें
                currentWeatherData = weatherData; 
                if (weatherContent) weatherContent.classList.add('hidden'); 
            } else {
                // CASE B: Normal weather request (Show weather in card and small message in chat)
                responseToDisplay = "Mausam ki jaankari aur forecast uper dedicated weather card mein display ki gayi hai.";
                // Update the weather panel
                currentWeatherData = weatherData; 
                updateWeatherUI(weatherData); 
                showMessage(`Weather report successfully parsed for ${weatherData.city}.`, false);
            }
            
        } else {
            // CASE C: Not a weather query (Show full botText)
            showMessage(``, false);
        }
        
        // 5. Display the final response
        appendMessage(responseToDisplay, 'bot', sources); 
        // 6. Bot's full response added to history
        conversationHistory.push({ role: "model", parts: [{ text: botText }] });
    }
     catch (error) {
        console.error("Chat Error:", error);
        const errorMessage = `An error occurred: ${error.message}`;
        appendMessage(errorMessage, 'bot');
        speakBotResponse("Server se connect nahi ho pa raha. Kripya check karein ki Node.js server chal raha hai.", 'hi-IN');
        // Remove user message from history if the bot's response failed
        if (conversationHistory.length > 0) conversationHistory.pop(); 
    }
     finally {
        if(sendMessageButton) sendMessageButton.disabled = false;
        if(micButton) micButton.disabled = false; 
        if(chatInput) {
            chatInput.disabled = false;
            chatInput.focus();
        }
    }
};


// ======================================================================
// === 7. Event Listeners and Initial Setup ===
// ======================================================================

// ✅ FIX: Event listener checks
if (micButton) {
    micButton.addEventListener('click', () => {
        if (!recognitionInstance) {
            showMessage("Voice recognition not initialized. Check browser support.", true);
            return;
        }
        if (isRecording) {
            recognitionInstance.stop(); 
        } else {
            startRecognition(); 
        }
    });
}

if(unitToggle) { // ✅ FIX: Event listener check
    unitToggle.addEventListener('click', () => {
        if (currentUnit === 'celsius') {
            currentUnit = 'fahrenheit';
            unitToggle.textContent = 'Switch to °C';
        } else {
            currentUnit = 'celsius';
            unitToggle.textContent = 'Switch to °F';
        }
        if (currentWeatherData) {
            updateWeatherUI(currentWeatherData);
        }
    });
}

if (sendMessageButton && chatInput) {
    sendMessageButton.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleChatSubmit();
        }
    });
}

window.onload = () => {
    updateClock();
    // Use requestAnimationFrame or setTimeout for more stable clock, but setInterval is okay for this context
    setInterval(updateClock, 1000); 
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    } 
    setupVoiceRecognition(); 
    clearWeatherUI();
    if (chatWindow) {
        const welcomeMessage = `Namaste! Main aapka AI Assistant Vision hoon. Microphone button par click karke bol sakte hain ya phir type karein.`;
        appendMessage(welcomeMessage, 'bot');
    }
};