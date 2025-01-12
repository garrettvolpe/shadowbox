document.getElementById("save-setting-bttn").addEventListener('click', saveSettings);
document.getElementById('restore-defaults').addEventListener('click', restoreDefaultSetting);

const musicToggle = document.getElementById('music-toggle');
const roundInput = document.getElementById('rounds');
const durationInput = document.getElementById('duration');
const restTimeInput = document.getElementById('rest-time');


let savedNumOfRounds;
let savedDuration;
let savedRestTime;
let backgroundMusic;


//Variables
function setIntialSettings() {
  savedNumOfRounds = localStorage.getItem('rounds');
  savedDuration = localStorage.getItem('round-duration');
  savedRestTime = localStorage.getItem('rest-time');
  backgroundMusic = localStorage.getItem('background-music');

    if (savedNumOfRounds == null) {
        localStorage.setItem('rounds', roundInput.value);
        localStorage.setItem('round-duration', durationInput.value);
        localStorage.setItem('rest-time', restTimeInput.value);
        localStorage.setItem('background-music', false)
        }
    else{
        roundInput.value = savedNumOfRounds;
        durationInput.value = savedDuration;
        restTimeInput.value = savedRestTime;
        if (backgroundMusic === 'true') {
            musicToggle.checked = true;
        } else {
            musicToggle.checked = false;
        }
    }
}

function saveSettings() {
  let numOfRounds = document.getElementById('rounds').value;
  let roundDuration = document.getElementById('duration').value;
  let restTime = document.getElementById('rest-time').value;
  const backgroundMusic = document.getElementById('music-toggle').checked;

  localStorage.setItem('rounds', numOfRounds);
  localStorage.setItem('round-duration', roundDuration);
  localStorage.setItem('rest-time', restTime);
  localStorage.setItem('background-music', backgroundMusic);
}

function restoreDefaultSetting() {
    localStorage.removeItem('rounds');
    localStorage.removeItem('round-duration');
    localStorage.removeItem('rest-time');
    localStorage.removeItem('background-music');
    setIntialSettings()
}

setIntialSettings();