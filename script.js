/* ===================== elements ===================== */
const btn = document.querySelector("#btn");
const feed = document.querySelector("#feed");
const orb = document.querySelector("#orb");
const orbState = document.querySelector("#orbState");
const clockEl = document.querySelector("#clock");
const muteBtn = document.querySelector("#muteBtn");
const textInput = document.querySelector("#textInput");
const camBtn = document.querySelector("#camBtn");
const cameraFeed = document.querySelector("#camera-feed");

let voiceEnabled = true;
let cameraStream = null;

/* ===================== clock ===================== */
function tickClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
tickClock();
setInterval(tickClock, 1000 * 15);

/* ===================== chat feed ===================== */
function addBubble(text, who) {
  const el = document.createElement("div");
  el.className = `bubble ${who}`;
  el.textContent = text;
  feed.appendChild(el);
  feed.scrollTop = feed.scrollHeight;
  return el;
}

/* ===================== speech synthesis ===================== */
function speak(text) {
  addBubble(text, "jarvis");
  orbState.textContent = text;

  if (!voiceEnabled || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.volume = 1;

  utter.onstart = () => setOrbState("speaking", "Speaking…");
  utter.onend = () => setOrbState("idle", "Tap the mic and say something");

  window.speechSynthesis.speak(utter);
}

function setOrbState(state, label) {
  orb.classList.remove("listening", "speaking");
  if (state === "listening" || state === "speaking") orb.classList.add(state);
  orbState.textContent = label;
}

/* ===================== greeting ===================== */
function wishMe() {
  const hours = new Date().getHours();
  let greeting;
  if (hours < 12) greeting = "Good morning, sir.";
  else if (hours < 16) greeting = "Good afternoon, sir.";
  else greeting = "Good evening, sir.";
  speak(`${greeting} JARVIS online, how can I help?`);
}
window.addEventListener("load", wishMe);

/* ===================== mute toggle ===================== */
muteBtn.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  muteBtn.classList.toggle("muted", !voiceEnabled);
  if (!voiceEnabled) window.speechSynthesis.cancel();
});

/* ===================== speech recognition ===================== */
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

if (SpeechRecognitionAPI) {
  recognition = new SpeechRecognitionAPI();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    if (transcript) {
      addBubble(transcript, "user");
      takeCommand(transcript.toLowerCase());
    }
  };

  recognition.onerror = () => stopListening();
  recognition.onend = () => stopListening();
} else {
  orbState.textContent = "Voice recognition isn't supported in this browser — type instead.";
}

function startListening() {
  if (!recognition || listening) return;
  try {
    recognition.start();
    listening = true;
    btn.classList.add("listening");
    setOrbState("listening", "Listening…");
  } catch (e) { /* already started */ }
}

function stopListening() {
  listening = false;
  btn.classList.remove("listening");
  if (!orb.classList.contains("speaking")) setOrbState("idle", "Tap the mic and say something");
}

btn.addEventListener("click", () => {
  if (listening) {
    recognition.stop();
    stopListening();
  } else {
    startListening();
  }
});

/* ===================== text input fallback ===================== */
textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && textInput.value.trim()) {
    const msg = textInput.value.trim();
    addBubble(msg, "user");
    takeCommand(msg.toLowerCase());
    textInput.value = "";
  }
});

/* ===================== camera ===================== */
async function openCamera() {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    cameraFeed.srcObject = cameraStream;
    cameraFeed.classList.add("active");
  } catch (err) {
    speak("I couldn't access the camera. Please check permissions.");
  }
}
function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((t) => t.stop());
    cameraStream = null;
  }
  cameraFeed.classList.remove("active");
}
camBtn.addEventListener("click", () => {
  cameraFeed.classList.contains("active") ? closeCamera() : openCamera();
});

/* ===================== commands ===================== */
// Each entry: { test: (msg) => bool, run: (msg) => void }
const commands = [
  {
    test: (m) => /\b(hello|hey|hi)\b/.test(m),
    run: () => speak("Hello sir, what can I help you with?"),
  },
  {
    test: (m) => m.includes("who are you"),
    run: () => speak("I am JARVIS, a virtual assistant built for you."),
  },
  {
    test: (m) => m.includes("how are you"),
    run: () => speak("Running at full capacity, sir. How can I help?"),
  },
  {
    test: (m) => /\b(time)\b/.test(m) && !m.includes("sometimes"),
    run: () => speak(`It's ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} right now.`),
  },
  {
    test: (m) => m.includes("date") || m.includes("today"),
    run: () => speak(`Today is ${new Date().toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}.`),
  },
  {
    test: (m) => m.includes("open youtube"),
    run: () => { speak("Opening YouTube."); window.open("https://www.youtube.com/", "_blank"); },
  },
  {
    test: (m) => m.includes("open google"),
    run: () => { speak("Opening Google."); window.open("https://www.google.com/", "_blank"); },
  },
  {
    test: (m) => m.includes("open whatsapp"),
    run: () => { speak("Opening WhatsApp."); window.open("https://web.whatsapp.com/", "_blank"); },
  },
  {
    test: (m) => m.includes("open maps") || m.includes("open map"),
    run: () => { speak("Opening Maps."); window.open("https://maps.google.com/", "_blank"); },
  },
  {
    test: (m) => m.includes("close camera") || m.includes("stop camera"),
    run: () => { speak("Closing the camera."); closeCamera(); },
  },
  {
    test: (m) => m.includes("open camera") || m.includes("open the camera"),
    run: () => { speak("Opening the camera."); openCamera(); },
  },
  {
    test: (m) => m.includes("joke"),
    run: () => {
      const jokes = [
        "I would tell you a UDP joke, but you might not get it.",
        "There are 10 kinds of people: those who understand binary, and those who don't.",
        "I told my computer I needed a break, and it said no problem — it would go to sleep.",
      ];
      speak(jokes[Math.floor(Math.random() * jokes.length)]);
    },
  },
  {
    test: (m) => m.includes("what is python"),
    run: () => speak("Python is an interpreted, high-level, object-oriented language known for readable syntax and rapid development."),
  },
  {
    test: (m) => m.includes("what is javascript"),
    run: () => speak("JavaScript is the scripting language that powers interactivity across the web, running in every modern browser."),
  },
  {
    test: (m) => m.includes("what is a neural network") || m.includes("what is neural network"),
    run: () => speak("A neural network is a layered system of interconnected nodes, loosely inspired by the brain, used to recognize patterns in data."),
  },
  {
    test: (m) => m.includes("what is fuzzy logic"),
    run: () => speak("Fuzzy logic handles reasoning that's approximate rather than fixed, useful when inputs are uncertain or imprecise."),
  },
  {
    test: (m) => m.includes("what is a virtual assistant") || m.includes("what is virtual assistant"),
    run: () => speak("A virtual assistant is software that performs tasks or answers questions through voice or text."),
  },
  {
    test: (m) => m.includes("thank you") || m.includes("thanks"),
    run: () => speak("Anytime, sir."),
  },
  {
    test: (m) => m.includes("clear chat") || m.includes("clear the chat"),
    run: () => { feed.innerHTML = ""; },
  },
];

function takeCommand(message) {
  const match = commands.find((c) => c.test(message));
  if (match) {
    match.run(message);
    return;
  }
  speak(`Here's what I found on the web for "${message}".`);
  window.open(`https://www.google.com/search?q=${encodeURIComponent(message)}`, "_blank");
}

/* ===================== PWA service worker ===================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
