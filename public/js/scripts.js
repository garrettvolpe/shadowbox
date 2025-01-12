document.getElementById("start-button").addEventListener('click', startTimer); 
document.getElementById('stop-button').addEventListener('click', stopTimer);

//Get all variables
let savedDuration = localStorage.getItem('round-times')
let convertedSavedDuration = parseInt(savedDuration) * 60;
let timerInterval; 
const timerDisplay = document.getElementById('timer-display')

console.log(savedDuration);

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
  timerInterval = setInterval(() => {
    if(convertedSavedDuration > 0){
            convertedSavedDuration --;
            updateTimerDisplay(); 
    }
    }, 1000)

    playBackgroundMusic(); 
}

function stopTimer() {
    clearInterval(timerInterval);
}

function playBackgroundMusic(){
    let bgMusic = new Audio('/audio/music.mp3');
    bgMusic.play();
}

setInitialDisplayTime();



