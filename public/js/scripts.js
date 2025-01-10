// Constants for time calculations (in milliseconds)
const ONE_SECOND = 1000;
const INITIAL_COUNTDOWN_TIME = 3;

// UI Elements Cache
const startButton = document.getElementById('start-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const stopButton = document.getElementById('stop-button');
const musicToggle = document.getElementById('music-toggle');
const countdownDisplay = document.getElementById('countdown');
const timerDisplay = document.getElementById('timer-display');
const restCountdownDisplay = document.getElementById('rest-countdown');
const settingIcon = document.getElementById('setting-icon');
const settingsContainer = document.getElementById('settings-container');
const roundTimeInput = document.getElementById('round-time');
const initialTimerDisplay = document.querySelector('.timer-format');

// Global Variables (Use with Care)
let countdownInterval;
let roundTimeout;
let audioTimeout;
let restTimeout;
let currentAudio;
let audioFiles = {
    basics: [],
    combos: [],
    advanced: []
};
let lastFolder = '';
let paused = false;
let pausedTime = 0;
let musicPlaying = false;
let musicAudio;
let currentRound = 1;

// Event listeners
startButton.addEventListener('click', startWorkout);
pauseButton.addEventListener('click', pauseWorkout);
resumeButton.addEventListener('click', resumeWorkout);
stopButton.addEventListener('click', stopWorkout);
musicToggle.addEventListener('change', toggleMusic);
settingIcon.addEventListener('click', toggleSettings);
roundTimeInput.addEventListener('change', updateInitialTimerDisplay); // Add event listener for round time changes


//Helper functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
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

function playAudioFile(audioPath) {
    currentAudio = new Audio(audioPath);
    currentAudio.onerror = () => console.error(`Error loading audio file: ${audioPath}`);
    currentAudio.play();
}
function updateInitialTimerDisplay() {
    const roundTimeValue = parseInt(roundTimeInput.value);
    initialTimerDisplay.textContent = formatTime(roundTimeValue * 60); // Set initial timer display to the round time
}

// Start workout function
function startWorkout() {
    const rounds = document.getElementById('rounds').value;
    const roundTime = parseInt(document.getElementById('round-time').value) * 60;  //Get latest user input
    const restTime = document.getElementById('rest-time').value * 60 || 60; // Default rest time of 1 minute
    let count = INITIAL_COUNTDOWN_TIME;
    
    // Display starting UI
    showElement(countdownDisplay);
    showElement(stopButton);
    showElement(pauseButton);
    hideElement(resumeButton);
    hideElement(settingsContainer);
    
    paused = false;
    pausedTime = 0; // Reset paused time

    playAudioFile(generateAudioPath('misc/bell_start.mp3'))

    countdownInterval = setInterval(() => {
        countdownDisplay.textContent = count;
        if (count === 0) {
            clearInterval(countdownInterval);
            hideElement(countdownDisplay);
             startRounds(rounds, roundTime, restTime);
             if(timerDisplay) {
                 showElement(timerDisplay);
             }

        }
        count--;
    }, ONE_SECOND);
}

function resumeWorkout() {
    paused = false;
    if (timerDisplay) {
        const timerText = timerDisplay.textContent;
        const parts = timerText.split(':');
        const minutes = parseInt(parts[0].replace(/[^\d]/g, ''));
        const seconds = parseInt(parts[1].replace(/[^\d]/g, ''));
        pausedTime = minutes * 60 + seconds;
    }

    startRound(pausedTime);
    showElement(pauseButton);
    hideElement(resumeButton);
}

// Main function that manages rounds
async function startRounds(rounds, roundTime, restTime) {

    async function startRound() {
        if (timerDisplay) {
            showElement(timerDisplay);
        }
    
        if (musicToggle.checked && !musicPlaying) {
            playMusic();
        }
    
        let timeLeft;
         if (paused) {
            timeLeft = pausedTime;
            paused = false;

        } else {
           timeLeft = roundTime;
        }
        updateTimer(timeLeft, currentRound);

      function updateTimer(timeLeft, currentRound){
            if (timeLeft > 0) {
               if(timerDisplay){
                 timerDisplay.textContent = `${formatTime(timeLeft)}`;
               }
               timeLeft--;
               roundTimeout = setTimeout(() => updateTimer(timeLeft, currentRound), ONE_SECOND);
            } else {
              playAudioFile(generateAudioPath('misc/bell_end.mp3'));
              stopAudio();
                if (currentRound < rounds) {
                    currentRound++;
                    if(timerDisplay){
                      timerDisplay.textContent = `Rest Time: ${formatTime(restTime)}`;
                    }
                    startRest(restTime);
                } else {
                  playAudioFile(generateAudioPath('misc/bell_end.mp3'));
                  stopAudio();
                    if(timerDisplay){
                       timerDisplay.textContent = 'Workout Complete!';
                    }
                  stopMusic();
                  hideElement(pauseButton);
                  hideElement(resumeButton);
                  hideElement(stopButton);
                }
           }
        }
        scheduleNextAudio();
      }


    function startRest(restTime) {
         stopAudio();
         stopMusic();

        hideElement(timerDisplay);
        showElement(restCountdownDisplay);
        let restTimeLeft = restTime;

        function updateRestTimer(){
            if (restTimeLeft > 0) {
                restCountdownDisplay.textContent = `Rest Time: ${formatTime(restTimeLeft)}`;
                 restTimeLeft--;
                 restTimeout = setTimeout(updateRestTimer, ONE_SECOND);
            } else {
                hideElement(restCountdownDisplay);
                startRound();
            }
        }
        updateRestTimer();
    }

     function scheduleNextAudio() {
        const randomDelay = Math.random() * 1500 + 1000;
        audioTimeout = setTimeout(() => {
            if (!currentAudio || currentAudio.paused) {
                playRandomAudio();
            }
            scheduleNextAudio();
        }, randomDelay);
    }

    startRound();
}

function generateAudioPath(file) {
    return `audio/${file}`;
}

function pauseWorkout() {
    paused = true;
    hideElement(startButton);
    hideElement(pauseButton);
    showElement(resumeButton);
    clearTimeout(roundTimeout);
    clearTimeout(audioTimeout);
    clearTimeout(restTimeout);
    stopAudio();
    stopMusic();
    const timerText = document.getElementById('timer-display').textContent;
      const parts = timerText.split(':');
    const minutes = parseInt(parts[1].replace(/[^\d]/g, ''));
    const seconds = parseInt(parts[2]);
    pausedTime = minutes * 60 + seconds;
    hideElement(pauseButton);
    showElement(resumeButton);

}

function resumeWorkout() {
    paused = false;
      if (timerDisplay) {
        const timerText = document.getElementById('timer-display').textContent;
        const parts = timerText.split(':');
        const minutes = parseInt(parts[0].replace(/[^\d]/g, ''));
        const seconds = parseInt(parts[1]);
        pausedTime = minutes * 60 + seconds;
     }
     const rounds = document.getElementById('rounds').value;
     const restTime = document.getElementById('rest-time').value * 60 || 60; // Default rest time of 1 minute
     let count = INITIAL_COUNTDOWN_TIME;
     
     // Display starting UI
     hideElement(countdownDisplay);
     showElement(stopButton);
     showElement(pauseButton);
     hideElement(resumeButton);
     hideElement(settingsContainer);
     showElement(startButton)

     startRounds(rounds, pausedTime, restTime)
}

function playMusic() {
    if (musicPlaying) return;
    musicAudio = new Audio('audio/music.mp3'); // Replace with your music file path
    musicAudio.loop = true;
    musicAudio.addEventListener('canplaythrough', () => {
        musicAudio.play().catch(error => console.error('Music playback error:', error));
        musicPlaying = true;
    });
    musicAudio.onerror = () => console.error('Error loading music audio.');
     musicAudio.load();
}

function stopMusic() {
    if (!musicPlaying) return;
    musicAudio.pause();
    musicAudio.currentTime = 0;
    musicPlaying = false;
}

function toggleMusic() {
    if (musicToggle.checked) {
         if (!musicPlaying) playMusic();
    } else {
        stopMusic();
    }
}

function toggleSettings(){
    if(settingsContainer && settingsContainer.classList.contains('hidden')){
        showElement(settingsContainer)
    } else if(settingsContainer){
        hideElement(settingsContainer);
    }

}


function playRandomAudio() {
    const folder = selectFolder();
    const files = audioFiles[folder];

    if (!files || files.length === 0) {
        console.error(`No audio files found for folder: ${folder}`);
        return;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const audioPath = `audio/${folder}/${files[randomIndex]}`;
    playAudioFile(audioPath);
}

function stopAudio(){
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function selectFolder() {
    const folders = ['basics', 'combos', 'advanced'];
    let folder = folders[Math.floor(Math.random() * folders.length)];

    if (folder === 'advanced' && lastFolder === 'advanced') {
        folder = folders.filter(f => f !== 'advanced')[Math.floor(Math.random() * 2)];
    }

    lastFolder = folder;
    return folder;
}

function stopWorkout() {
    clearInterval(countdownInterval);
    clearTimeout(roundTimeout);
    clearTimeout(audioTimeout);
    clearTimeout(restTimeout);
    stopAudio();
    stopMusic();

    hideElement(countdownDisplay);
    showElement(timerDisplay);
    hideElement(restCountdownDisplay);
    hideElement(pauseButton);
    hideElement(resumeButton);
    hideElement(stopButton);
    showElement(startButton);
    updateInitialTimerDisplay();

    paused = false;
    pausedTime = 0;
}

fetch('/audio-files')
    .then(response => response.json())
    .then(files => {
        audioFiles.basics = files.basics || [];
        audioFiles.combos = files.combos || [];
        audioFiles.advanced = files.advanced || [];
        console.log('Audio files loaded:', audioFiles);
    })
    .catch(error => {
        console.error('Error fetching audio files:', error);
    });

// Call the initial timer display update function when the page loads
updateInitialTimerDisplay();