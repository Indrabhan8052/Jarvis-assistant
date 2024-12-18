let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");
let cameraFeed = document.querySelector("#camera-feed");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    if (hours >= 0 && hours < 12) {
        speak("Good morning sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good afternoon sir");
    } else {
        speak("Good evening sir");
    }
}

window.addEventListener('load', () => {
    wishMe();
});

let speechRecognition = window.speechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();
recognition.onresult = (event) => {
    let currentIndex = event.resultIndex;
    let transcript = event.results[currentIndex][0].transcript;
    content.innerText = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
    recognition.start();
    btn.style.display = "none";
    voice.style.display = "block";
});

function takeCommand(message) {
    btn.style.display = "flex";
    voice.style.display = "none";
    if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, What can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am Jarvis, created by Indra Bhan Verma");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("http://www.youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://www.google.com/", "_blank");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("https://www.whatsapp.com/", "_blank");
    } else if (message.includes("open the camera")) {
speak("Opening the camera...");
window.location.href ="Camera.html"; // Navigate to PhoneCamera.html
}
else if(message.includes("what is python")){
speak("Python is an interpreted, object-oriented, high-level programming language with dynamic semantics.Its high-level built in data structures, combined with dynamic typing and dynamic binding, make it very attractive for Rapid Application Development, as well as for use as a scripting or glue language to connect existing components together. ")
}
else if(message.includes("what is JavaScript")){
    speak("JavaScript is a programming language that allows developers to create interactive web pages.")
    }
else if(message.includes("what is neural network")){
     speak("A neural network is a system of interconnected neurons that mimics the human brain's ability to process information. ")
    }
 else if(message.includes("what is fuzzy logic")){
    speak("Fuzzy logic is a logical system that incorporates uncertainty into decision-making, and is often used to solve complex problems where parameters are unclear or imprecise.")
    }
else if(message.includes("what is virtual assistant")){
    speak("A virtual assistant (VA) is a self-employed professional who works remotely to provide administrative services to clients.")
    }
else if(message.includes("how are you")){
    speak("I am fine , tell about yourself")
        }
    else {
        speak(`This is what I found on the internet regarding ${message}`);
        window.open(`https://www.google.com/search?q=${message}`, "_blank");
    }
}
