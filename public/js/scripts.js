let savedDuration = localStorage.getItem('round-duration')
let convertedSavedDuration = parseInt(savedDuration) * 60;
let timerInterval = null; 
let preTimerCDTimer = null;
const timerDisplay = document.getElementById('timer-display')
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');

//Event Listeners
startButton.addEventListener('click', preTimerCD); 
stopButton.addEventListener('click', stopTimer);
// pauseButton.addEventListener('click', pauseTimer); 
// resumeButton.addEventListener('click', resumeTimer);


//Problem with this function is broken if 10+ min and unable to set seconds. Must store in seconds and convert. 
function setInitialDisplayTime() {
    timerDisplay.textContent =  "0" + savedDuration + ":00"; 
}

//Function to update the timer display
function updateTimerDisplay(){
   const minutes = Math.floor(convertedSavedDuration / 60); //Converts to a whole number
   const seconds = convertedSavedDuration % 60; /* Takes remainder of calculation above. Ex: convertedSaveDurtion = 60, the remainder of 60/60 = 0; 0 is returned */ 

   /* padStart function first parameter forces 2 slots of text, second paramater adds 0 in any space required. Ex: 7 returns 07*/
   let formatMinutes = String(minutes).padStart(2, "0");
   let formatSeconds = String(seconds).padStart(2, "0");
   
   timerDisplay.textContent = `${formatMinutes}:${formatSeconds}`;
}


function startTimer() {
    clearInterval(preTimerCDTimer);
    if(timerInterval == null){
    timerInterval = setInterval(() => {
    if(convertedSavedDuration > 0){
            convertedSavedDuration --;
            updateTimerDisplay(); 
    }
    }, 1000)

    playBackgroundMusic(); 
}
}

function stopTimer() {
    clearInterval(timerInterval);
}

function playBackgroundMusic(){
    if (localStorage.getItem('background-music') == 'true' ){
    let bgMusic = new Audio('/audio/music.mp3');
    bgMusic.play();
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

function preTimerCD(){
    let intervalCount = 4; //is 4 because we subtract 4-1 = 3, 2, 1....
    timerDisplay.textContent = "Get Ready!";
    if(preTimerCDTimer == null){ //If the timer == null then run code
        preTimerCDTimer = setInterval(() => {
            if(intervalCount > 1 ){ //Chanes to one to skip se
                intervalCount--; 
                timerDisplay.textContent = intervalCount;
                console.log(intervalCount);
            }
            else {
                startTimer();
                updateTimerDisplay()
            }
            
        }, 1000)
    }
}

setInitialDisplayTime();


