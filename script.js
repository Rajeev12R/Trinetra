function toggleChat() {
    let chatContainer = document.getElementById("chatContainer");
    chatContainer.classList.toggle("hidden");
}

async function sendMessage() {
    let inputField = document.getElementById("userInput");
    let message = inputField.value.trim();
    if (!message) return;

    appendMessage("You: " + message, "user");
    inputField.value = "";
    showTypingIndicator();

    try {
        const res = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        const data = await res.json();
        removeTypingIndicator();
        appendMessage("HealthGuru: " + data.reply, "HealthGuru");
    } catch (error) {
        removeTypingIndicator();
        appendMessage("Bot: Sorry, something went wrong!", "bot");
    }
}

function appendMessage(text, sender) {
    let chatBox = document.getElementById("chatBox");
    let div = document.createElement("div");
    div.textContent = text;
    div.className = sender === "user"
        ? "self-end bg-blue-500 text-white p-3 rounded-lg shadow-md max-w-xs"
        : "self-start bg-gray-300 text-black p-3 rounded-lg shadow-md max-w-xs";
    chatBox.appendChild(div);
    scrollToBottom();
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function showTypingIndicator() {
    let chatBox = document.getElementById("chatBox");
    let div = document.createElement("div");
    div.id = "typingIndicator";
    div.textContent = "HealthGuru is typing...";
    div.className = "self-start bg-gray-200 text-black p-2 rounded-lg italic text-sm";
    chatBox.appendChild(div);
    scrollToBottom();
}

function removeTypingIndicator() {
    let indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
}

function scrollToBottom() {
    let chatBox = document.getElementById("chatBox");
    chatBox.scrollTop = chatBox.scrollHeight;
}

function startListening() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech Recognition is not supported in this browser.');
        return;
    }

    let recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // Show "Listening..." Indicator
    let chatBox = document.getElementById("chatBox");
    let listeningIndicator = document.createElement("div");
    listeningIndicator.id = "listeningIndicator";
    listeningIndicator.textContent = "🎙️ Listening...";
    listeningIndicator.className = "self-start bg-yellow-300 text-black p-2 rounded-lg italic text-sm";
    chatBox.appendChild(listeningIndicator);
    scrollToBottom();

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript; // Fill input with recognized text
        removeListeningIndicator();
        sendMessage(); // Send message automatically after recognition
    };

    recognition.onerror = function () {
        removeListeningIndicator();
        appendMessage("HealthGuru: Voice recognition error!", "HealthGuru");
    };

    recognition.onend = function () {
        removeListeningIndicator();
    };

    recognition.start();
}

function removeListeningIndicator() {
    let indicator = document.getElementById("listeningIndicator");
    if (indicator) indicator.remove();
}
