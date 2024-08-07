document.getElementById('start-button').addEventListener('click', startWorkout);
document.getElementById('stop-button').addEventListener('click', stopWorkout);

let countdownInterval;
let roundInterval;
let audioFiles = [];

function startWorkout() {
  const rounds = document.getElementById('rounds').value;
  const roundTime = document.getElementById('round-time').value * 60;
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
      startRounds(rounds, roundTime, audioFiles, timer);
    }
    count--;
  }, 1000);
}

function startRounds(rounds, roundTime, audioFiles, timer) {
  let currentRound = 1;
  let timeLeft = roundTime;

  roundInterval = setInterval(() => {
    if (timeLeft > 0) {
      timer.textContent = `Round ${currentRound}: ${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
      if (timeLeft % 5 === 0) {
        playRandomAudio(audioFiles);
      }
      timeLeft--;
    } else {
      if (currentRound < rounds) {
        currentRound++;
        timeLeft = roundTime;
      } else {
        clearInterval(roundInterval);
        timer.textContent = 'Workout Complete!';
        document.getElementById('stop-button').classList.add('hidden');
      }
    }
  }, 1000);
}

function playRandomAudio(audioFiles) {
  const randomIndex = Math.floor(Math.random() * audioFiles.length);
  const audio = new Audio(`audio/${audioFiles[randomIndex]}`);
  audio.play();
}

function stopWorkout() {
  clearInterval(countdownInterval);
  clearInterval(roundInterval);
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
