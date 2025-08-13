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

const TimerState = Object.freeze({});

let timerInterval;

/*                      ////////// Timer Class Formatting //////////
        -- Any variable with m_[VariableName] is a member of the class and
        cannot be used outside the scope of said class. 
*/
class Timer {
  m_RoundStartSound = new Audio("./audio/misc/bell_start.mp3");
  m_RoundEndSound = new Audio("./audio/misc/bell_end.mp3");
  m_RoundCounter = 1;

  constructor(roundDuration, roundRestTime, numberOfRounds) {
    this.m_RoundDuration = roundDuration;
    this.m_RoundRestTime = roundRestTime;
    this.m_NumberOfRounds = numberOfRounds;
  }

  InitializeTimer() {
    this.m_RoundCounter = 1;
    this.m_RemainingTime = this.m_RoundDuration;
    this.m_RemainingRestTime = this.m_RoundRestTime;
    timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
    timerLabel.textContent = TimerLabelText.IDLETXT;
  }

  StartTimer() {
    this.PlayBellAudio(this.m_RemainingTime);
    if (this.m_RoundCounter <= this.m_NumberOfRounds) {
      timerInterval = setInterval(() => {
        this.UpdateTimer();
      }, 1000);
      console.log(this.m_RoundCounter);
    }
  }

  PauseTimer() {
    clearTimeout(timerInterval);
  }

  ResumeTimer() {
    timerInterval = setInterval(() => {
      this.UpdateTimer();
    }, 1000);
  }

  ResetTimer() {
    clearInterval(timerInterval);
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
    this.PlayBellAudio(this.m_RemainingTime);

    if (this.m_RemainingTime >= 0) {
      timerLabel.textContent = TimerLabelText.RUNNINGTXT;
      timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
      this.m_RemainingTime--;
    } else if (this.m_RemainingRestTime >= 0) {
      timerLabel.textContent = TimerLabelText.RESTTXT;
      timerDisplay.textContent = this.FormatTimerText(this.m_RemainingRestTime);
      this.m_RemainingRestTime--;
    } else if (this.m_RemainingRestTime <= 0) {
      this.InitializeNextRoundTimer();
    }
  }

  PlayBellAudio(remainingTime) {
    if (remainingTime == this.m_RoundDuration) {
      this.m_RoundStartSound.play();
    }
    if (remainingTime == 0) {
      this.m_RoundEndSound.play();
      remainingTime = -1;
    }
  }

  InitializeNextRoundTimer() {
    if (this.m_RoundCounter == this.m_NumberOfRounds) {
      this.ResetTimer();
      return;
    }

    this.m_RoundCounter++;
    this.m_RemainingTime = this.m_RoundDuration;
    this.m_RemainingRestTime = this.m_RoundRestTime;
    timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
    timerLabel.textContent = TimerLabelText.RUNNINGTXT;
  }
}

const newTimer = new Timer(5, 5, 2);
newTimer.InitializeTimer();

startButton.addEventListener("click", () => newTimer.StartTimer());
pauseButton.addEventListener("click", () => newTimer.PauseTimer());
resumeButton.addEventListener("click", () => newTimer.ResumeTimer());
resetButton.addEventListener("click", () => newTimer.ResetTimer());
