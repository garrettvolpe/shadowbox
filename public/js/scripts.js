

//Public Intialized Varables
let isAdvancedChecked = localStorage.getItem('isChecked');

let myStartTimer = null;
let countDownTimer = null;
let audioInterval;

//Public Unintilized Variables

let savedDuration;
let currentTimeLeft;
let savedTime;

let bgMusic = new Audio('/audio/music.mp3'); 

//DOM elements
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const resetButton = document.getElementById('reset-button');

//Arrays for Audio Files
const basicAudio = [
    new Audio('../audio/basics/basic1.mp3'),
    new Audio('../audio/basics/basic4.mp3'), 
    new Audio('../audio/basics/basic3.mp3')
];

const advancedAudio = [
    new Audio('../audio/basics/basic1.mp3'),
    new Audio('../audio/basics/basic4.mp3'), 
    new Audio('../audio/basics/basic3.mp3'),
    new Audio('../audio/advanced/ComboADV2.mp3'),
    new Audio('../audio/advanced/doublejab.mp3'),
    new Audio('../audio/advanced/feint12low.mp3'),
    new Audio('../audio/advanced/feintjab.mp3'),
    new Audio('../audio/advanced/leanBack.mp3'),
    new Audio('../audio/advanced/leanbackkick.mp3'),
    new Audio('../audio/advanced/moveffet.mp3'),
    new Audio('../audio/advanced/rkick.mp3')
];
//End of Audiofiles

//Event Listeners
startButton.addEventListener('click', countDown);
stopButton.addEventListener('click', stopTimer);    
resumeButton.addEventListener('click', resumeTimer);
resetButton.addEventListener('click', resetTimer);
pauseButton.addEventListener('click', resetTimer);



firstTimeSetting();

//FUN
function firstTimeSetting() {
    if(!localStorage.getItem('round-duration')){
        localStorage.setItem('round-duration', '3');
        localStorage.setItem('rounds', 3);
        localStorage.setItem('rest-time', 30);
        localStorage.setItem('background-music', false)
        savedDuration = localStorage.getItem('round-duration')
        currentTimeLeft = parseInt(savedDuration) * 60;  
        timerDisplay.textContent = formatTime(currentTimeLeft);
    }
    else {  
        savedDuration = localStorage.getItem('round-duration');
        currentTimeLeft = parseInt(savedDuration) * 60;
        timerDisplay.textContent = formatTime(currentTimeLeft);
    }
}

function countDown(){
    showElement(stopButton); 
    hideElement(startButton);
    let intervalCount = 4; //is 4 because we subtract 4-1 = 3, 2, 1....
    timerDisplay.textContent = "Get Ready!";
    countDownTimer = null;
    if(countDownTimer == null){ //If the timer == null then run code
        countDownTimer = setInterval(() => {
            if(intervalCount > 1 ){ //Chanes to one to skip se
                intervalCount--; 
                timerDisplay.textContent = intervalCount;
                
            }
            else {
                
                startTimer(currentTimeLeft);
                updateTimerDisplay();
                countDownTimer == null;
                
            }
        }, 1000)
    }
}

function startTimer(timeLeft) {
    hideElement(resetButton)
    clearInterval(countDownTimer);
    playAudio(); 
    
    timeLeft = currentTimeLeft;
    
    if(myStartTimer == null){
    myStartTimer = setInterval(() => {
    if(currentTimeLeft > 0){
            currentTimeLeft --;
            updateTimerDisplay(); 
            
        }
        else {
            clearInterval(myStartTimer);
            stopAudio();
        }
    }, 1000)

    playBackgroundMusic(); 
}
}

function stopTimer() {
    clearInterval(myStartTimer);
    clearInterval(audioInterval);
    showElement(resumeButton);
    showElement(resetButton);
    hideElement(stopButton)
    savedTime = currentTimeLeft // Save the remaining time
    stopAudio();
    myStartTimer = null;
}

function resumeTimer() {
    if(savedTime != null){
        currentTimeLeft = savedTime;
        //debugger;
    }
    startTimer(currentTimeLeft);
    
    updateTimerDisplay();
    hideElement(resumeButton); 
    showElement(stopButton); 
    
}

function resetTimer(){
    timerDisplay.innerText = formatTime(parseInt(savedDuration) * 60)
    currentTimeLeft = localStorage.getItem('round-duration');
    bgMusic.currentTime = 0;
    hideElement(resetButton);
    hideElement(resumeButton);
    showElement(startButton);
}

//Function to update the timer display
function updateTimerDisplay(){
    timerDisplay.textContent = formatTime(currentTimeLeft);
  }
  
  function formatTime(totalSeconds) {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formatMinutes = String(minutes).padStart(2, '0');
      const formatSeconds = String(seconds).padStart(2, '0');
      return `${formatMinutes}:${formatSeconds}`;
  }

function playBackgroundMusic(){
    if (localStorage.getItem('background-music') == 'true' ){
    bgMusic.play();
    }
}

function stopAudio(){
    bgMusic.pause();
    pickRandomAudio().pause;
    //will add logic to stop combos being called later
}

//Function to play audio based on selected settings
function playAudio() { 
    pickRandomAudio().play;
   audioInterval = setInterval(function() {
    pickRandomAudio().play(); 
   }, 3000);
}

function pickRandomAudio(audioArray){
    let randomIndex = Math.floor(Math.random(100) * 100); 
    console.log(randomIndex);
      
    if (randomIndex < 55){
        let randomBasicAudioArrayIndex = Math.floor(Math.random() * basicAudio.length);
        return basicAudio[randomBasicAudioArrayIndex]; 
        
    }
    else if(randomIndex >= 55 && randomIndex < 80) {
        let randomAdvAudioArrayIndex = Math.floor(Math.random() * advancedAudio.length);
        return advancedAudio[randomAdvAudioArrayIndex]; 
    }
    else {
        console.log("SHOULD BE GAY")
    }
    
}

function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
   }
}

function hideElement(element) {
   if (element) {
      element.classList.add('hidden');
   }
}

