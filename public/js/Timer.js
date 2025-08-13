const timerDisplay = document.getElementById("timer-display");
const timerLabel = document.getElementById("timer-label");

const startButton = document.getElementById("start-button");
const stopButton = document.getElementById("stop-button");
const pauseButton = document.getElementById("pause-button");
const resumeButton = document.getElementById("resume-button");
const resetButton = document.getElementById("reset-button");

//ENUM - JS doesnt have default enumerators //

const TimerLabelText = Object.freeze({
  IDLETXT: "ARE YOU READY?",
  RUNNINGTXT: "WORK",
  RESTTXT: "REST",
});

const ComboAudio = [
  new Audio("./audio/basics/basic1.mp3"),
  new Audio("./audio/basics/basic3.mp3"),
  new Audio("./audio/basics/basic4.mp3"),
];

const roundStartSound = new Audio("./audio/misc/bell_start.mp3");
const roundEndSound = new Audio("./audio/misc/bell_end.mp3");

let timerInterval;
let comboInterval;

/*                      ////////// Timer Class Formatting //////////
        -- Any variable with m_[VariableName] is a member of the class and
        cannot be used outside the scope of said class. 
*/
class Timer {
  m_RoundCounter = 1;
  m_IsWorkTimeRunning;

  constructor(roundDuration, roundRestTime, numberOfRounds) {
    this.m_RoundDuration = roundDuration;
    this.m_RoundRestTime = roundRestTime;
    this.m_NumberOfRounds = numberOfRounds;
  }

  InitializeTimer() {
    this.m_RoundCounter = 1;
    this.m_RemainingTime = this.m_RoundDuration;
    this.m_RemainingRestTime = this.m_RoundRestTime;
    this.m_IsWorkTimeRunning = false;
    timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
    timerLabel.textContent = TimerLabelText.IDLETXT;
  }

  StartTimer() {
    startButton.classList.add("hidden");
    resumeButton.classList.remove("hidden");
    this.PlayAudio(roundStartSound);
    this.m_IsWorkTimeRunning = true;
    timerInterval = setInterval(() => {
      this.UpdateTimer();
    }, 1000);
  }

  PauseTimer() {
    clearInterval(comboInterval);
    clearTimeout(timerInterval);
  }

  ResumeTimer() {
    timerInterval = setInterval(() => {
      this.UpdateTimer();
    }, 1000);
  }

  ResetTimer() {
    startButton.classList.remove("hidden");
    resumeButton.classList.add("hidden");
    clearInterval(timerInterval);
    clearInterval(comboInterval);
    this.InitializeTimer();
  }

  FormatTimerText(remainingTime) {
    let minutes;
    let seconds;

    minutes = Math.floor(remainingTime / 60);
    seconds = remainingTime % 60;

    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  }

  UpdateTimer() {
    if (!this.m_IsWorkTimeRunning) {
      clearInterval(comboInterval);
    }

    if (this.m_RemainingTime == 1) {
      this.PlayAudio(roundEndSound);
    }

    if (this.m_RemainingTime >= 0) {
      this.m_IsWorkTimeRunning = true;

      timerLabel.textContent = TimerLabelText.RUNNINGTXT;
      timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
      this.m_RemainingTime--;
    } else if (this.m_RemainingRestTime >= 0) {
      this.m_IsWorkTimeRunning = false;
      timerLabel.textContent = TimerLabelText.RESTTXT;
      timerDisplay.textContent = this.FormatTimerText(this.m_RemainingRestTime);
      this.m_RemainingRestTime--;
    } else if (
      this.m_RemainingRestTime <= 0 &&
      this.m_RoundCounter != this.m_NumberOfRounds
    ) {
      this.InitializeNextRoundTimer();
      this.PlayAudio(roundStartSound);
    }
    else 
    {
        this.ResetTimer();
    }
  }

  PlayAudio(audioSource, ...index) {
    if (audioSource == []) {
      audioSource[i].play();
    } else {
      audioSource.play();
    }
  }

  InitializeNextRoundTimer() {
    this.m_RoundCounter++;
    this.m_RemainingTime = this.m_RoundDuration;
    this.m_RemainingRestTime = this.m_RoundRestTime;
    timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
    timerLabel.textContent = TimerLabelText.RUNNINGTXT;
    this.m_IsWorkTimeRunning = true;
  }
}

const newTimer = new Timer(10, 5, 2);
newTimer.InitializeTimer();

startButton.addEventListener("click", () => newTimer.StartTimer());
pauseButton.addEventListener("click", () => newTimer.PauseTimer());
resumeButton.addEventListener("click", () => newTimer.ResumeTimer());
resetButton.addEventListener("click", () => newTimer.ResetTimer());
