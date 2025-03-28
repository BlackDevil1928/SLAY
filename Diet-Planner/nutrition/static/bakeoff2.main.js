function changeTab(tabName, color) {
    if (tabName == 'Food') window.location.href = 'index.html' + window.location.search;
    if (tabName == 'History') window.location.href = 'history.html' + window.location.search;
    if (tabName == 'Track') window.location.href = 'track.html' + window.location.search;
    if (tabName == 'Preference') window.location.href = 'preference.html' + window.location.search;
    if (tabName == 'Recipes') window.location.href = 'Recipes.html' + window.location.search;
}

function openTab(cityName, color) {
   
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
    	tabcontent[i].style.display = "none";
        console.log(tabcontent[i])
    }
 
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
    	tablinks[i].style.backgroundColor = "";
    }

    document.getElementById(cityName).style.display = "block";
    console.log(document.getElementById(cityName));


    var tabID = cityName + '-tab'
    document.getElementById(tabID).style.backgroundColor = color;
}

window.onload = function() {
    
    const chatButton = document.createElement("div");
    chatButton.id = "chat-icon";
    chatButton.textContent = "Chat";
    chatButton.onclick = openChatbot;
    document.body.appendChild(chatButton);

    
    const chatWindow = document.createElement("div");
    chatWindow.id = "chat-window";
    chatWindow.style.display = "none"; 
    chatWindow.innerHTML = `
        <div id="chat-history" style="height: 80%; overflow-y: auto; margin-bottom: 10px; padding: 5px; background-color: #f9f9f9;"></div>
        <input type="text" id="chat-input" placeholder="Type your message here..." style="width: 80%;" />
        <button onclick="sendMessage()" style="width: 18%;">Send</button>
    `;
    document.body.appendChild(chatWindow);
};


function openChatbot() {
    const chatWindow = document.getElementById("chat-window");
    chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
}


const styles = `
    #chat-icon {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 10px 15px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        text-align: center;
        z-index: 1000;
    }
    #chat-window {
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 300px;
        height: 400px;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #fff;
        padding: 10px;
        overflow-y: auto;
        z-index: 1000;
    }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

async function sendMessage() {
    const inputField = document.getElementById("chat-input");
    const chatHistory = document.getElementById("chat-history");
    const userMessage = inputField.value;

 
    if (userMessage.trim()) {
        const userMessageElement = document.createElement("div");
        userMessageElement.textContent = "You: " + userMessage;
        userMessageElement.style.margin = "5px 0";
        chatHistory.appendChild(userMessageElement);
        inputField.value = "";

      
        const response = await getChatbotResponse(userMessage);

  
        const botMessageElement = document.createElement("div");
        botMessageElement.textContent = "Bot: " + response;
        botMessageElement.style.margin = "5px 0";
        botMessageElement.style.fontStyle = "italic";
        chatHistory.appendChild(botMessageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight; 
    }
}


async function getChatbotResponse(message) {
    try {
        let reply;

        // Convert the message to lowercase to make it case-insensitive
        const lowerCaseMessage = message.toLowerCase();

        // Check for specific keywords or phrases and return different responses
        if (lowerCaseMessage.includes("hello")) {
            reply = "Hi there! How can I assist you with your diet today?";
        } else if (lowerCaseMessage.includes("help")) {
            reply = "Sure! What do you need help with in your diet or nutrition?";
        } else if (lowerCaseMessage.includes("bye")) {
            reply = "Goodbye! Stay healthy and take care!";
        } else if (lowerCaseMessage.includes("thanks")) {
            reply = "You're welcome! Let me know if you need anything else.";
        } else if (lowerCaseMessage.includes("allergic") && lowerCaseMessage.includes("food")) {
            reply = "If you're allergic to certain foods, I recommend consulting a nutritionist to create a safe and balanced diet plan. You can also ask me for allergen-free food options!";
        } else if (lowerCaseMessage.includes("diet plan")) {
            reply = "I can help you with a personalized diet plan! Could you tell me your goals (e.g., weight loss, muscle gain, etc.) and any food preferences or restrictions you have?";
        } else if (lowerCaseMessage.includes("calories")) {
            reply = "If you're looking for calorie count, I can suggest foods that fit within your target calorie range. What is your daily calorie target?";
        } else if (lowerCaseMessage.includes("weight loss")) {
            reply = `
**Weight Loss Foods**
- Leafy Greens: Spinach, kale – low in calories but high in fiber and vitamins.
- Eggs: High in protein, keep you full longer.
- Oats: A slow-digesting carb that stabilizes blood sugar levels.
- Lean Proteins: Chicken breast, turkey, or legumes.
- Berries: Low in sugar, rich in antioxidants.
- Greek Yogurt: High in protein and probiotics.
            `;
        } else if (lowerCaseMessage.includes("muscle gain")) {
            reply = `
**Muscle Gain Foods**
- Chicken Breast: High in protein and low in fat.
- Egg Whites: A lean protein option.
- Brown Rice: A complex carb for sustained energy.
- Quinoa: Rich in protein and essential amino acids.
- Salmon: Packed with omega-3 fatty acids and protein.
- Cottage Cheese: A slow-digesting protein source.
- Peanut Butter: Healthy fats and protein.
            `;
        } else if (lowerCaseMessage.includes("healthy snacks")) {
            reply = `
**Healthy Snacks**
- Nuts: Almonds, walnuts, cashews.
- Greek Yogurt: Low-fat and high-protein options.
- Fruits: Apples, bananas, berries.
- Veggies with Dip: Carrots, celery with hummus.
- Rice Cakes with Peanut Butter: A low-calorie option.
- Boiled Eggs: Packed with protein.
            `;
        } else if (lowerCaseMessage.includes("low carb")) {
            reply = `
**Low-Carb Foods**
- Leafy Greens: Spinach, kale, arugula.
- Proteins: Grilled chicken, fish, tofu.
- Vegetables: Cauliflower, broccoli, zucchini.
- Healthy Fats: Avocado, olive oil, nuts.
- Snacks: Hard-boiled eggs, cheese sticks.
            `;
        } else if (lowerCaseMessage.includes("high protein")) {
            reply = `
**High-Protein Foods**
- Meats: Chicken, turkey, lean beef.
- Fish: Salmon, tuna, mackerel.
- Legumes: Lentils, black beans, chickpeas.
- Eggs: Complete protein source.
- Dairy: Greek yogurt, milk, cheese.
- Plant-Based Options: Tofu, tempeh, edamame.
- Nuts & Seeds: Almonds, chia seeds, flaxseeds.
            `;
        } else if (lowerCaseMessage.includes("allergen free")) {
            reply = `
**Allergen-Free Foods**
- Rice (white or brown): Naturally gluten-free and allergen-free.
- Quinoa: A complete protein and allergen-free grain.
- Sweet Potatoes: Nutrient-dense and free from common allergens.
- Fruits: Apples, bananas, berries.
- Vegetables: Carrots, spinach, zucchini.
- Proteins: Tofu (if soy allergy-free), chicken, or fish like salmon.
            `;
        } else if (lowerCaseMessage.includes("meal for") && lowerCaseMessage.includes("energy")) {
            reply = "A great energy-boosting meal would include complex carbs, protein, and healthy fats. Would you like me to suggest one?";
        } else {
            // Default response for unrecognized input
            reply = "I'm not sure how to respond to that. Can you ask something related to your diet or nutrition?";
        }

        return reply;

    } catch (error) {
        console.error("Error fetching chatbot response:", error);
        return "Oops! Something went wrong. Please try again later.";
    }
}

