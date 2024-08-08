document.getElementById('start-button').addEventListener('click', startWorkout);
document.getElementById('pause-button').addEventListener('click', pauseWorkout);
document.getElementById('resume-button').addEventListener('click', resumeWorkout);
document.getElementById('stop-button').addEventListener('click', stopWorkout);

let countdownInterval;
let roundTimeout;
let audioTimeout;
let currentAudio;
let restTimeout;
let audioFiles = {
    basics: [],
    combos: [],
    advanced: []
};
let lastFolder = '';
let paused = false;
let pausedTime = 0;

function startWorkout() {
    const rounds = document.getElementById('rounds').value;
    const roundTime = document.getElementById('round-time').value * 60;
    const restTime = document.getElementById('rest-time').value * 60 || 60;
    const countdown = document.getElementById('countdown');
    const timer = document.getElementById('timer');
    const stopButton = document.getElementById('stop-button');
    const pauseButton = document.getElementById('pause-button');
    const resumeButton = document.getElementById('resume-button');

    countdown.classList.remove('hidden');
    stopButton.classList.remove('hidden');
    pauseButton.classList.remove('hidden');
    resumeButton.classList.add('hidden'); // Ensure resume button is hidden initially
    paused = false;
    pausedTime = 0;
    let count = 3;

    countdownInterval = setInterval(() => {
        countdown.textContent = count;
        if (count === 0) {
            clearInterval(countdownInterval);
            countdown.classList.add('hidden');
            timer.classList.remove('hidden');
            startRounds(rounds, roundTime, restTime, timer);
        }
        count--;
    }, 1000);
}

function startRounds(rounds, roundTime, restTime, timer) {
    let currentRound = 1;

    function startRound() {
        playAudio('audio/misc/bell_start.mp3');
        let timeLeft;
        if (paused) {
            timeLeft = pausedTime; // Resume from where it was paused
        } else {
            timeLeft = roundTime; // Start with the full round time
        }
        
        paused = false; // Reset the paused state since the workout is now active
        paused = false;

        function updateTimer() {
            if (timeLeft > 0) {
                timer.textContent = `Round ${currentRound}: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
                timeLeft--;
                roundTimeout = setTimeout(updateTimer, 1000);
                console.log(timeLeft)
            } else {
                playAudio('audio/misc/bell_end.mp3');
                if (currentRound < rounds) {
                    currentRound++;
                    timer.textContent = `Rest Time: ${Math.floor(restTime / 60)}:${restTime % 60 < 10 ? '0' : ''}${restTime % 60}`;
                    startRest(restTime);
                } else {
                    timer.textContent = 'Workout Complete!';
                    document.getElementById('pause-button').classList.add('hidden');
                    document.getElementById('resume-button').classList.add('hidden');
                    document.getElementById('stop-button').classList.add('hidden');
                }
            }
        }

        updateTimer();
        scheduleNextAudio();
    }

    function startRest(restTime) {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        restTimeout = setTimeout(() => {
            startRound();
        }, restTime * 1000);
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

function pauseWorkout() {
    paused = true;
    clearTimeout(roundTimeout);
    clearTimeout(audioTimeout);
    clearTimeout(restTimeout);
    if (currentAudio) {
        currentAudio.pause();
    }

    const timerText = document.getElementById('timer').textContent;
    console.log(timerText);

    // Extract the round time in minutes and seconds from the timer text
    const parts = timerText.split(':');
    console.log(parts)
    const minutes = parseInt(parts[1].replace(/[^\d]/g, '')); // Extract only the digits from the minutes part
    console.log(minutes)
    const seconds = parseInt(parts[2]);
    console.log (seconds)
    // Convert the entire time to seconds
    pausedTime = minutes * 60 + seconds;
    console.log(pausedTime);

    // Show the resume button and hide the pause button
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('resume-button').classList.remove('hidden');
}
function resumeWorkout() {
    paused = false;
    startRounds(document.getElementById('rounds').value, pausedTime, document.getElementById('rest-time').value * 60 || 60, document.getElementById('timer'));

    // Show the pause button and hide the resume button
    document.getElementById('pause-button').classList.remove('hidden');
    document.getElementById('resume-button').classList.add('hidden');
}

function playRandomAudio() {
    const folder = selectFolder();
    const files = audioFiles[folder];

    console.log(`Selected folder: ${folder}`);
    console.log(`Files in selected folder:`, files);

    if (!files || files.length === 0) {
        console.error(`No audio files found for folder: ${folder}`);
        return;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    currentAudio = new Audio(`audio/${folder}/${files[randomIndex]}`);
    currentAudio.play();
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

function playAudio(audioPath) {
    currentAudio = new Audio(audioPath);
    currentAudio.play();
}

function stopWorkout() {
    clearInterval(countdownInterval);
    clearTimeout(roundTimeout);
    clearTimeout(audioTimeout);
    clearTimeout(restTimeout);
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    document.getElementById('countdown').classList.add('hidden');
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('resume-button').classList.add('hidden');
    document.getElementById('stop-button').classList.add('hidden');
    document.getElementById('timer').textContent = '';
    paused = false;
    pausedTime = 0;
}

fetch('/audio-files')
    .then(response => response.json())
    .then(files => {
        console.log('Server response:', files);
        audioFiles.basics = files.basics || [];
        audioFiles.combos = files.combos || [];
        audioFiles.advanced = files.advanced || [];
        console.log('Audio files loaded:', audioFiles);
    })
    .catch(error => {
        console.error('Error fetching audio files:', error);
    });
