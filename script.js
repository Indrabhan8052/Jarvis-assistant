let btn=document.querySelector("#btn")
let content=document.querySelector("#content")
let voice=document.querySelector("#voice")
function speak(text){
    let text_speak=new SpeechSynthesisUtterance(text)
    text_speak.rate=1
    text_speak.pitch=1
    text_speak.volume=1
    text_speak.lang="en-GB"
    window.speechSynthesis.speak(text_speak)
}
function wishMe(){
    let day=new Date()
    let hours=day.getHours()
    if(hours>=0 && hours<12){
        speak("Good morning sir")
    }
    else if(hours>=12 && hours<16){
        speak("Good afternoon sir")
    }
    else{
        speak("Good evening sir")
    }
}
window.addEventListener('load',()=>{
    wishMe()

})
let speechRecognition=window.speechRecognition || window.webkitSpeechRecognition
let recognition= new speechRecognition()
recognition.onresult=(event)=>{
    let currentIndex=event.resultIndex
    let transcript=event.results[currentIndex][0].transcript
    content.innerText=transcript
    takeCommand(transcript.toLowerCase())
}  
btn.addEventListener("click",()=>{
     recognition.start()
     btn.style.display=" none"
     voice.style.display="block"
})
function takeCommand(message){
    btn.style.display="flex"
    voice.style.display="none"
    if(message.includes("hello") || message.includes("hey")){
        speak("Hello sir, What can I help you")
    }
    else if(message.includes(" who are you")){
        speak("I am Jarvis, created by Indra Bhan Verma")
    }
    else if(message.includes("open youtube")){
        speak("opening youtube...")
          window.open("http://www.youtube.com/","_blank")
    }
    else if(message.includes("open google")){
        speak("opening google...")
          window.open("https://www.google.com/","_blank")
    }
    else if(message.includes("open chrome")){
        speak("opening chrome...")
          window.open("https://www.chrome.com/","_blank")
    }
    else if(message.includes("open whatsapp")){
        speak("opening whatsapp...")
          window.open("https://www.whatsapp.com/","_blank")
    }
    else{
        speak(`this is what i found on the internet regarding${message}`)
        window.open(`https://www.google.com/search?q= ${message}`)
    }
}