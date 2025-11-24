

// // ✅ FIX: URL से अनावश्यक स्पेस हटा दिया गया है
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

//     humidityEl.textContent = data.details.humidity || 'N/A';
//     windSpeedEl.textContent = data.details.windSpeed || 'N/A';
//     pressureEl.textContent = data.details.pressure || 'N/A';
//     
//     const aqiInfo = getAqiDescription(data.details.aqiIndex || 'N/A');
//     aqiIndexEl.textContent = data.details.aqiIndex || 'N/A';
//     aqiDescriptionEl.textContent = aqiInfo.description;
//     aqiDescriptionEl.className = `aqi-pill text-xs mt-1 p-0.5 rounded ${aqiInfo.classes}`;
//     
//     uvIndexEl.textContent = data.details.uvIndex || 'N/A';
//     uvAdviceEl.textContent = getUVAdvice(data.details.uvIndex);
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
//     // --- 1. City Matching (More flexible + Cleaning) ---
//     const cityMatch = text.match(/(?:weather in|for|in)\s+([A-Z][A-Za-z\s]+?)\s*(?:is|currently|weather|$|\.)/i);
//     if (cityMatch) {
//         data.city = cityMatch[1] || 'Location';
//         data.city = data.city.trim().replace(/[.,]$/g, '');
//         data.city = data.city.replace(/zila|Jila|District/gi, '').trim(); 
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
//     const detailsRegex = /Details\s*:\s*Humidity\s*:\s*([^,]+?)\s*(?:,|\s*Wind)/i;
//     const windRegex = /Wind\s*speed\s*:\s*([^,]+?)\s*(?:,|\s*Pressure)/i;
//     const pressureRegex = /Pressure\s*:\s*([^,]+?)\s*(?:,|\s*UV)/i;
//     const uvRegex = /UV\s*Index\s*:\s*([^,]+?)\s*(?:,|\s*Air)/i;
//     const aqiRegex = /Air\s*Quality\s*:\s*([^.]+)/i; 
//     const getMatch = (regex) => text.match(regex)?.[1]?.trim().replace(/\[|\]|%|hPa|km\/h|\./g, '') || 'N/A';
//     data.details.humidity = getMatch(detailsRegex);
//     data.details.windSpeed = getMatch(windRegex);
//     data.details.pressure = getMatch(pressureRegex);
//     data.details.uvIndex = getMatch(uvRegex);
//     const aqiFull = getMatch(aqiRegex);
//     if (aqiFull !== 'N/A') {
//         data.details.aqi = aqiFull.match(/([A-Za-z\s]+)/)?.[1]?.trim() || aqiFull;
//         data.details.aqiIndex = aqiFull.match(/\((\d+)\)/)?.[1] || aqiFull.match(/AQI\s*(\d+)/i)?.[1] || aqiFull.match(/(\d+)/)?.[1] || 'N/A';
//     }
//     if (data.temp.current !== 'N/A' && data.temp.feelsLike === 'N/A') {
//         data.temp.feelsLike = data.temp.current; 
//     }
//     // --- 5. Mock Forecast Data (Using Parsed Temp) ---
//     if (data.temp.current !== 'N/A' && !isNaN(parseFloat(data.temp.current))) {
//         const baseTemp = parseFloat(data.temp.current);
//         const desc = data.description !== 'N/A' ? data.description : 'clear sky';
//         
//         data.forecasts.hourly = [
//             { time: '3h', temp: baseTemp + 1, description: desc.includes('rain') ? 'partly cloudy' : desc },
//             { time: '6h', temp: baseTemp + 2, description: desc },
//             { time: '9h', temp: baseTemp + 1, description: desc.includes('rain') ? 'clear sky' : desc }
//         ].filter(item => !isNaN(item.temp));

//         data.forecasts.daily = [
//             { day: 'Mon', tempMax: baseTemp + 3, tempMin: baseTemp - 5, description: 'Partly Cloudy' },
//             { day: 'Tue', tempMax: baseTemp + 2, tempMin: baseTemp - 4, description: 'Clouds' },
//             { day: 'Wed', tempMax: baseTemp + 1, tempMin: baseTemp - 3, description: 'Rain' }
//         ].filter(item => !isNaN(item.tempMax));
//     }
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
//     const userText = chatInput.value.trim();
//     if (userText === '') return;
//     clearWeatherUI(); 
//     // 1. Display user message and add to history
//     appendMessage(userText, 'user');
//     conversationHistory.push({ role: "user", parts: [{ text: userText }] }); 

//     chatInput.value = '';
//     sendMessageButton.disabled = true;
//     if(micButton) micButton.disabled = true; 
//     chatInput.disabled = true;
//     
//     try {
//         // 3. Call API and wait for response 
//         const responseData = await callChatApi(userText, conversationHistory);
//         
//         const botText = responseData.botText || ''; 
//         const sources = responseData.sources || [];

//         // 4. Check for weather data (Now with highly robust parsing)
//         const weatherData = parseWeatherReport(botText); 
//         
//         let responseToDisplay = botText;
//         if (weatherData) {
//             responseToDisplay = "Mausam ki jaankari aur forecast uper dedicated weather card mein display ki gayi hai.";
//             
//             // Update the weather panel
//             currentWeatherData = weatherData; 
//             updateWeatherUI(weatherData); 
//             showMessage(`Weather report successfully parsed for ${weatherData.city}.`, false);
//         } else {
//             showMessage(``, false);
//         }
//         // 5. Display the final response
//         appendMessage(responseToDisplay, 'bot', sources); 
//         // 6. Bot's full response added to history
//         conversationHistory.push({ role: "model", parts: [{ text: botText }] });
//     }
//      catch (error) {
//         console.error("Chat Error:", error);
//         const errorMessage = `An error occurred: ${error.message}`;
//         appendMessage(errorMessage, 'bot');
//         speakBotResponse("Server se connect nahi ho pa raha. Kripya check karein ki Node.js server chal raha hai.", 'hi-IN');
//         // Remove the user message from history if API failed, so retrying works
//         conversationHistory.pop(); 
//     }
//      finally {
//         // 7. Reset UI state
//         sendMessageButton.disabled = false;
//         if(micButton) micButton.disabled = false; 
//         chatInput.disabled = false;
//         chatInput.focus();
//     }
// };


// // ======================================================================
// // === 7. Event Listeners and Initial Setup ===
// // ======================================================================

// // माइक बटन क्लिक लिसनर (Click-to-Talk Logic)
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

// 💾 Global State & Memory
let conversationHistory = []; 
let currentUnit = 'celsius'; 
let currentWeatherData = null; 

// --- VOICE RECOGNITION GLOBAL STATE ---
let recognitionInstance;
let isRecording = false; 

// --- DOM Elements ---
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
// === 2. VOICE RESPONSE (Text-to-Speech) ===
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
    if (!recognitionInstance || isRecording) return; 

    isRecording = true;
    if(micButton) micButton.classList.add('mic-active');
    chatInput.placeholder = "Bol rahe hain... (Listening for your question...)";

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

        chatInput.value = transcript;
        handleChatSubmit(); 
    };

    recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
        showMessage(`Voice input error: ${event.error}. Please ensure microphone access is granted.`, true);
        
        isRecording = false;
        if(micButton) micButton.classList.remove('mic-active');
        chatInput.placeholder = "Aap kya jaanna chahte hain?";
    };

    recognition.onend = () => {
        isRecording = false;
        if(micButton) micButton.classList.remove('mic-active');
        chatInput.placeholder = "Aap kya jaanna chahte hain?";
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

    if (currentDateEl) currentDateEl.textContent = now.toLocaleDateString(undefined, dateOptions);
    if (currentTimeEl) currentTimeEl.textContent = now.toLocaleTimeString(undefined, timeOptions);
};

const formatTemperature = (tempBase, unitSymbol) => {
    let displayTemp;
    const baseTempCelsius = parseFloat(tempBase);

    const isCelsiusInput = !unitSymbol || unitSymbol.includes('C');
    let tempC = isCelsiusInput ? baseTempCelsius : (baseTempCelsius - 32) * 5/9;
    
    if (isNaN(tempC)) return 'N/A'; 

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
    const desc = description.toLowerCase();
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
    weatherContent.classList.add('hidden'); 
    currentWeatherData = null;

    cityNameEl.textContent = '...';
    temperatureEl.textContent = '...';
    descriptionEl.textContent = '...';
    feelsLikeEl.textContent = '...';
    
    aqiDescriptionEl.textContent = '...';
    aqiDescriptionEl.className = 'aqi-pill bg-gray-500 text-white';
    uvAdviceEl.textContent = '';
    
    hourlyForecastContainer.innerHTML = '<p id="hourlyPlaceholder" class="text-gray-500 text-center w-full">Data not available yet.</p>';
    dailyForecastContainer.innerHTML = '<p id="dailyPlaceholder" class="text-gray-500 text-center w-full">Data not available yet.</p>';
    showMessage("");
};

const updateWeatherUI = (data) => {
    if (!data) {
        clearWeatherUI();
        return;
    }
    
    cityNameEl.textContent = data.city || 'Location Unknown';
    temperatureEl.textContent = formatTemperature(data.temp.current, data.temp.unit);
    descriptionEl.textContent = data.description || 'N/A';

    const feelsLikeDisplay = data.temp.feelsLike !== 'N/A' 
        ? data.temp.feelsLike 
        : data.temp.current;
        
    feelsLikeEl.textContent = formatTemperature(feelsLikeDisplay, data.temp.unit);

    const iconData = getWeatherIconName(data.description || '');
    weatherIconEl.innerHTML = `<i data-lucide="${iconData.icon}" class="text-white" style="width: 6rem; height: 6rem;"></i>`;

    humidityEl.textContent = data.details.humidity || 'N/A';
    windSpeedEl.textContent = data.details.windSpeed || 'N/A';
    pressureEl.textContent = data.details.pressure || 'N/A';
    
    const aqiInfo = getAqiDescription(data.details.aqiIndex || 'N/A');
    aqiIndexEl.textContent = data.details.aqiIndex || 'N/A';
    aqiDescriptionEl.textContent = data.details.aqi || aqiInfo.description; // Use parsed AQI description first
    aqiDescriptionEl.className = `aqi-pill text-xs mt-1 p-0.5 rounded ${aqiInfo.classes}`;
    
    uvIndexEl.textContent = data.details.uvIndex || 'N/A';
    uvAdviceEl.textContent = getUVAdvice(data.details.uvIndex);
    
    displayForecast(hourlyForecastContainer, data.forecasts.hourly, true, data.temp.unit);
    displayForecast(dailyForecastContainer, data.forecasts.daily, false, data.temp.unit);
    weatherContent.classList.remove('hidden');
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

const displayForecast = (container, forecastArray, isHourly, tempUnit) => {
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
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

function renderMarkdown(markdownText) {
    let html = markdownText;
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

const appendMessage = (text, type, sources = []) => {
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
            sourceHtml += `<li class="mt-1"><a href="${src.uri}" target="_blank" class="text-indigo-400 hover:text-indigo-200 underline block truncate" title="${src.title}">${index + 1}. ${src.title || src.uri}</a></li>`;
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
    
    // --- 1. City Matching (More flexible + Cleaning) ---
    const cityMatch = text.match(/(?:weather in|for|in)\s+([A-Z][A-Za-z\s]+?)\s*(?:is|currently|weather|$|\.)/i);
    if (cityMatch) {
        data.city = cityMatch[1] || 'Location';
        data.city = data.city.trim().replace(/[.,]$/g, '');
        data.city = data.city.replace(/zila|Jila|District/gi, '').trim(); 
    }

    // --- 2. Temperature Matching (Most robust for C or F) ---
    const tempRegex = /(\d+\.?\d*)\s*(?:degrees|temp)?\s*(°C|°F|C|F)/i;
    const tempMatch = text.match(tempRegex);

    if (tempMatch) {
        data.temp.current = tempMatch[1];
        data.temp.unit = tempMatch[2].toUpperCase().includes('C') ? '°C' : '°F';
    } else {
        const bareTempMatch = text.match(/(\d+)\s*(?:is|and)\s*([A-Za-z\s]+)/i); 
        if (bareTempMatch) {
            data.temp.current = bareTempMatch[1];
            data.temp.unit = '°C'; 
        }
    }

    // --- 3. Description Matching (Flexible positions + Cleaning) ---
    const descMatch = text.match(/and\s*([A-Za-z\s]+?)(?:\.|,|Details|\s*skies)/i) || 
                      text.match(/(?:conditions|is)\s*([A-Za-z\s]+?)\s*(?:skies|Detail|\.)/i);

    if (descMatch) {
        let descriptionRaw = (descMatch[1] || '').trim().replace(/[.,]$/g, '');
        descriptionRaw = descriptionRaw.replace(/साफ|बादल|बारिश|धूप|कोहरा|आसमान/g, '').trim();
        if (descriptionRaw === '' || descriptionRaw.toLowerCase() === 'skies') {
            data.description = 'N/A';
        } else {
            data.description = descriptionRaw;
        }
    }
    
    // --- 4. Details Matching (Handling missing spaces and commas) ---
    const detailsRegex = /Details\s*:\s*Humidity\s*:\s*([^,]+?)\s*(?:,|\s*Wind)/i;
    const windRegex = /Wind\s*speed\s*:\s*([^,]+?)\s*(?:,|\s*Pressure)/i;
    const pressureRegex = /Pressure\s*:\s*([^,]+?)\s*(?:,|\s*UV)/i;
    const uvRegex = /UV\s*Index\s*:\s*([^,]+?)\s*(?:,|\s*Air)/i;
    const aqiRegex = /Air\s*Quality\s*:\s*([^.]+)/i; 
    
    const getMatch = (regex) => text.match(regex)?.[1]?.trim().replace(/\[|\]|%|hPa|km\/h|\./g, '') || 'N/A';
    
    data.details.humidity = getMatch(detailsRegex);
    data.details.windSpeed = getMatch(windRegex);
    data.details.pressure = getMatch(pressureRegex);
    data.details.uvIndex = getMatch(uvRegex);
    
    // --- AQI Index & Description FIX ---
    const aqiFull = getMatch(aqiRegex);
    if (aqiFull !== 'N/A') {
        // AQI Index in brackets (e.g., (105)) or just a number
        const indexMatch = aqiFull.match(/\((\s*\d+)\s*\)/) || aqiFull.match(/(\s*\d+)/);
        data.details.aqiIndex = indexMatch?.[1]?.trim() || 'N/A';

        // AQI Description (e.g., Moderate, Unhealthy)
        const descMatch = aqiFull.match(/^([A-Za-z\s]+?)\s*(?:\()/) || aqiFull.match(/^([A-Za-z\s]+)/);
        data.details.aqi = descMatch?.[1]?.trim() || 'N/A';
    }
    
    if (data.temp.current !== 'N/A' && data.temp.feelsLike === 'N/A') {
        data.temp.feelsLike = data.temp.current; 
    }
    
    // --- 5. Live Forecast Parsing (Updated to parse Gemini's output) ---
    const parseForecast = (forecastType, textToParse) => {
        const results = [];
        // RegEx to find the entire forecast line (e.g., "Hourly Forecast: [..],[..]")
        const sectionMatch = textToParse.match(new RegExp(`${forecastType}\\s*Forecast\\s*:\\s*(.*)`, 'i'));
        
        if (!sectionMatch) return results;

        const forecastText = sectionMatch[1]; 
        
        // RegEx for Daily: [Day, Max, Min, Description]
        // Allows for optional °C/°F after temps
        const dailyItemRegex = /\[([^\]]+?)\s*,\s*(\d+)\s*(?:°C|°F)?\s*,\s*(\d+)\s*(?:°C|°F)?\s*,\s*([^\]]+?)\]/gi; 
        
        // RegEx for Hourly: [Time, Temp, Description]
        const hourlyItemRegex = /\[([^\]]+?)\s*,\s*(\d+)\s*(?:°C|°F)?\s*,\s*([^\]]+?)\]/gi;

        let match;
        if (forecastType.toLowerCase() === 'daily') {
            while ((match = dailyItemRegex.exec(forecastText)) !== null) {
                results.push({
                    day: match[1].trim(),
                    tempMax: parseFloat(match[2]),
                    tempMin: parseFloat(match[3]),
                    description: match[4].trim()
                });
            }
        } else if (forecastType.toLowerCase() === 'hourly') {
            while ((match = hourlyItemRegex.exec(forecastText)) !== null) {
                results.push({
                    time: match[1].trim(),
                    temp: parseFloat(match[2]),
                    description: match[3].trim().replace(/\[|\]/g, '')
                });
            }
        }
        return results;
    };
    
    // Apply the new live forecast parsing
    data.forecasts.hourly = parseForecast('Hourly', text);
    data.forecasts.daily = parseForecast('Daily', text);
    
    // Original Mocking Logic removed successfully!

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
            const errorData = await response.json().catch(() => ({})); 
            if (errorData.botText) {
                errorDetails = errorData.botText; 
            } else if (response.status === 403 || response.status === 401) {
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
        throw new Error(error.message);
    }
}

const handleChatSubmit = async () => {
    const userText = chatInput.value.trim();
    if (userText === '') return;
    clearWeatherUI(); 
    // 1. Display user message and add to history
    appendMessage(userText, 'user');
    conversationHistory.push({ role: "user", parts: [{ text: userText }] }); 

    chatInput.value = '';
    sendMessageButton.disabled = true;
    if(micButton) micButton.disabled = true; 
    chatInput.disabled = true;
    
    try {
        // 3. Call API and wait for response 
        const responseData = await callChatApi(userText, conversationHistory);
        
        const botText = responseData.botText || ''; 
        const sources = responseData.sources || [];

        // 4. Check for weather data (Now with highly robust parsing)
        const weatherData = parseWeatherReport(botText); 
        
        let responseToDisplay = botText;
        if (weatherData) {
            responseToDisplay = "Mausam ki jaankari aur forecast uper dedicated weather card mein display ki gayi hai.";
            
            // Update the weather panel
            currentWeatherData = weatherData; 
            updateWeatherUI(weatherData); 
            showMessage(`Weather report successfully parsed for ${weatherData.city}.`, false);
        } else {
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
        // Remove the user message from history if API failed, so retrying works
        conversationHistory.pop(); 
    }
     finally {
        // 7. Reset UI state
        sendMessageButton.disabled = false;
        if(micButton) micButton.disabled = false; 
        chatInput.disabled = false;
        chatInput.focus();
    }
};


// ======================================================================
// === 7. Event Listeners and Initial Setup ===
// ======================================================================

// माइक बटन क्लिक लिसनर (Click-to-Talk Logic)
if (micButton) {
    micButton.addEventListener('click', () => {
        if (isRecording) {
            recognitionInstance.stop(); 
        } else {
            startRecognition(); 
        }
    });
}

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