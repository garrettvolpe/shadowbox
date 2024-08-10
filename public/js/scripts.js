document.getElementById('start-button').addEventListener('click', startWorkout);
document.getElementById('pause-button').addEventListener('click', pauseWorkout);
document.getElementById('resume-button').addEventListener('click', resumeWorkout);
document.getElementById('stop-button').addEventListener('click', stopWorkout);
document.getElementById('music-toggle').addEventListener('change', toggleMusic);


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
let musicPlaying = false;


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
        timer.classList.remove('hidden')
        if (document.getElementById('music-toggle').checked) {
            playMusic();
        }
        playAudio('audio/misc/bell_start.mp3');
        let timeLeft;
        if (paused) {
            timeLeft = pausedTime; // Resume from where it was paused
        } else {
            timeLeft = roundTime; // Start with the full round time
        }
        
        paused = false; // Reset the paused state since the workout is now active

        function updateTimer() {
            if (timeLeft > 0) {
                timer.textContent = `Round ${currentRound}: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
                timeLeft--;
                roundTimeout = setTimeout(updateTimer, 1000);
                console.log(timeLeft)
            } else {
                playAudio('audio/misc/bell_end.mp3');
                clearTimeout(audioTimeout);
                playAudio('audio/misc/bell_end.mp3');
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                if (currentRound < rounds) {
                    currentRound++;
                    timer.textContent = `Rest Time: ${Math.floor(restTime / 60)}:${restTime % 60 < 10 ? '0' : ''}${restTime % 60}`;
                    startRest(restTime);
                } else {
                    playAudio('audio/misc/bell_end.mp3');
                    clearTimeout(audioTimeout);
                    playAudio('audio/misc/bell_end.mp3');
                    timer.textContent = 'Workout Complete!';
                    clearTimeout(audioTimeout);
                    if (currentAudio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                    }
                    document.getElementById('pause-button').classList.add('hidden');
                    document.getElementById('resume-button').classList.add('hidden');
                    document.getElementById('stop-button').classList.add('hidden');
                }
            }
        }

        updateTimer();
        scheduleNextAudio();
    }

    function startRest() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
    
        // Display the rest countdown timer
        timer.classList.add("hidden")
        const restCountdown = document.getElementById('rest-countdown');
        restCountdown.classList.remove('hidden');
        let restTimeLeft = restTime;
    
        function updateRestTimer() {
            if (restTimeLeft > 0) {
                restCountdown.textContent = `Rest Time: ${Math.floor(restTimeLeft / 60)}:${restTimeLeft % 60 < 10 ? '0' : ''}${restTimeLeft % 60}`;
                restTimeLeft--;
                restTimeout = setTimeout(updateRestTimer, 1000);
            } else {
                restCountdown.classList.add('hidden');
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
    stopMusic(); // Stop music on pause


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

function playMusic() {
    if (musicPlaying) return; // Prevent starting multiple instances
    musicAudio = new Audio('audio/music.mp3'); // Replace with your music file path
    musicAudio.loop = true;
    musicAudio.play();
    musicPlaying = true;
}

function stopMusic() {
    if (!musicPlaying) return;
    musicAudio.pause();
    musicAudio.currentTime = 0;
    musicPlaying = false;
}


function toggleMusic() {
    const musicToggle = document.getElementById('music-toggle');
    if (musicToggle.checked) {
        playMusic();
    } else {
        stopMusic();
    }
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

    stopMusic(); // Ensure music is stopped

    document.getElementById('countdown').classList.add('hidden');
    document.getElementById('timer').classList.add('hidden');
    document.getElementById('rest-countdown').classList.add('hidden'); // Hide rest countdown
    document.getElementById('pause-button').classList.add('hidden');
    document.getElementById('resume-button').classList.add('hidden');
    document.getElementById('stop-button').classList.add('hidden');
    document.getElementById('timer').textContent = '';
    paused = false;
    pausedTime = 0;
    currentRound = 1;
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


    //https://genny.lovo.ai/project/66b50b3ca7750a4c6f795ff1
    