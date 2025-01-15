let savedDuration = localStorage.getItem('round-duration');
let isAdvancedChecked = localStorage.getItem('isChecked');
let convertedSavedDuration = parseInt(savedDuration) * 60;
let timerInterval = null;
let preTimerCDTimer = null;
let currentTimeLeft = convertedSavedDuration; // Initialize with full duration
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const resetButton = document.getElementById('reset-button');
let bgMusic = new Audio('/audio/music.mp3');
let audioArray; 
let savedTime = null;
let randomAudioArrayIndex;

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
    new Audio('../audio/advanced/leanbBack.mp3'),
    new Audio('../audio/advanced/leanbackkick.mp3'),
    new Audio('../audio/advanced/moveffet.mp3'),
    new Audio('../audio/advanced/rkick.mp3')
];



//Event Listeners
startButton.addEventListener('click', preTimerCD);
stopButton.addEventListener('click', stopTimer);
resumeButton.addEventListener('click', resumeTimer);
resetButton.addEventListener('click', resetTimer);
pauseButton.addEventListener('click', resetTimer);

//Set items
timerDisplay.textContent = formatTime(convertedSavedDuration);


//Function to update the timer display
function updateTimerDisplay(){
  timerDisplay.textContent = formatTime(currentTimeLeft)
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formatMinutes = String(minutes).padStart(2, '0');
    const formatSeconds = String(seconds).padStart(2, '0');
    return `${formatMinutes}:${formatSeconds}`;
}

function preTimerCD(){
    showElement(stopButton)
    let intervalCount = 4; //is 4 because we subtract 4-1 = 3, 2, 1....
    timerDisplay.textContent = "Get Ready!";
    preTimerCDTimer = null;
    if(preTimerCDTimer == null){ //If the timer == null then run code
        preTimerCDTimer = setInterval(() => {
            if(intervalCount > 1 ){ //Chanes to one to skip se
                intervalCount--; 
                timerDisplay.textContent = intervalCount;
            }
            else {
                startTimer();
                updateTimerDisplay();
                preTimerCDTimer == null
            }
        }, 1000)
    }
}

function startTimer() {
    hideElement(resetButton)
    clearInterval(preTimerCDTimer);
    playAudio(); 
    if(timerInterval == null){
    timerInterval = setInterval(() => {
    if(currentTimeLeft > 0){
            currentTimeLeft --;
            updateTimerDisplay(); 
        }
        else {
            clearInterval(timerInterval);
            stopAudio();
        }
    }, 1000)

    playBackgroundMusic(); 
}
}

function stopTimer() {
    clearInterval(timerInterval);
    showElement(resetButton)
    savedTime = currentTimeLeft; // Save the remaining time
    stopAudio();
    console.log(savedTime)
    timerInterval = null;
}

function resumeTimer() {
    if(savedTime != null){
        currentTimeLeft = savedTime;
        savedTime = null;
    }
    else{
        currentTimeLeft = convertedSavedDuration;
    }
    startTimer();
    updateTimerDisplay();
}

function resetTimer(){
    timerDisplay.innerText = formatTime(parseInt(savedDuration) * 60)
    currentTimeLeft = (parseInt(savedDuration) * 60)
    bgMusic.currentTime = 0;
}

function playBackgroundMusic(){
    if (localStorage.getItem('background-music') == 'true' ){
    bgMusic.play();
    }
}

function stopAudio(){
    bgMusic.pause();
    //will add logic to stop combos being called later
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

//Function to play audio based on selected settings
function playAudio() { 
    if(isAdvancedChecked == 'true'){
        audioArray = advancedAudio; 
    }
    else {
     audioArray = basicAudio;   
    }

    randomAudioArrayIndex = Math.floor(Math.random() * audioArray.length);
    audioArray[randomAudioArrayIndex].play();
    //Audio.onEnd = () => { //Waits till audio ends and then delays the next combo
        setTimeout(playAudio, 4000);
    //}
    
}

