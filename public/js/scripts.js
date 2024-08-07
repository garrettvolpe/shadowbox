document.getElementById('start-button').addEventListener('click', startWorkout);
document.getElementById('stop-button').addEventListener('click', stopWorkout);

let countdownInterval;
let roundTimeout;
let audioTimeout;
let currentAudio;
let restTimeout;
let audioFiles = [];

function startWorkout() {
  const rounds = document.getElementById('rounds').value;
  const roundTime = document.getElementById('round-time').value * 60;
  const restTime = document.getElementById('rest-time').value * 60 || 60;
  const countdown = document.getElementById('countdown');
  const timer = document.getElementById('timer');
  const stopButton = document.getElementById('stop-button');

  countdown.classList.remove('hidden');
  stopButton.classList.remove('hidden');
  let count = 3;

  countdownInterval = setInterval(() => {
    countdown.textContent = count;
    if (count === 0) {
      clearInterval(countdownInterval);
      countdown.classList.add('hidden');
      timer.classList.remove('hidden');
      startRounds(rounds, roundTime, restTime, audioFiles, timer);
    }
    count--;
  }, 1000);
}

function startRounds(rounds, roundTime, restTime, audioFiles, timer) {
  let currentRound = 1;

  function startRound() {
    playAudio('audio/misc/bell_start.mp3');
    firstAudio(audioFiles)
    let timeLeft = roundTime;

    function updateTimer() {
      if (timeLeft > 0) {
        timer.textContent = `Round ${currentRound}: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
        timeLeft--;
        roundTimeout = setTimeout(updateTimer, 1000);
      } else {
        playAudio('audio/misc/bell_end.mp3');
        if (currentRound < rounds) {
          currentRound++;
          timer.textContent = `Rest Time: ${Math.floor(restTime / 60)}:${restTime % 60 < 10 ? '0' : ''}${restTime % 60}`;
          startRest(restTime);
        } else {
          timer.textContent = 'Workout Complete!';
          document.getElementById('stop-button').classList.add('hidden');
        }
      }
    }

    updateTimer();
    scheduleNextAudio();
  }

  function startRest(restTime) {
    restTimeout = setTimeout(() => {
      startRound();
    }, restTime * 1000);
  }

  function scheduleNextAudio() {
    const randomDelay = (Math.random() * 2 + 3) * 1000; // Random delay between 3000ms and 5000ms
    audioTimeout = setTimeout(() => {
      playRandomAudio(audioFiles);
      scheduleNextAudio();
    }, randomDelay);
  }

  function firstAudio() {
    const randomDelay = Math.random() * 1.5 + 1000; // Random delay between 1ms and 2.5ms
    audioTimeout = setTimeout(() => {
        playRandomAudio(audioFiles);
    }, randomDelay); // Delay in milliseconds
}

  startRound();
}

function playRandomAudio(audioFiles) {
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  currentAudio = new Audio(`audio/${audioFiles[randomIndex]}`);
  currentAudio.play();
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
  document.getElementById('stop-button').classList.add('hidden');
  document.getElementById('timer').textContent = '';
}

// Fetch the audio files from the server
fetch('/audio-files')
  .then(response => response.json())
  .then(files => {
    audioFiles = files;
  })
  .catch(error => {
    console.error('Error fetching audio files:', error);
  });
