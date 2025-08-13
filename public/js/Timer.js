const timerDisplay = document.getElementById('timer-display');
const timerLabel = document.getElementById('timer-label');

const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const resetButton = document.getElementById('reset-button');

// ENUM - JS doesnt have default enumerators //
const StateManager = Object.freeze({INITIALSTATE: 0, WORKRUNNING: 1, RESTRUNNING: 2, RESETTIMER: 3});

const TimerLabelText = Object.freeze({
    IDLETXT: 'ARE YOU READY?',
    RUNNINGTXT: 'WORK',
    RESTTXT: 'REST',
});

const ComboAudio = [
    new Audio('./audio/basics/basic1.mp3'),
    new Audio('./audio/basics/basic3.mp3'),
    new Audio('./audio/basics/basic4.mp3'),
];

const roundStartSound = new Audio('./audio/misc/bell_start.mp3');
const roundEndSound = new Audio('./audio/misc/bell_end.mp3');

let timerInterval;
let comboInterval;

/*                      ////////// Timer Class Formatting //////////
        -- Any variable with m_[VariableName] is a member of the class and
        cannot be used outside the scope of said class.
*/
class Timer
{
    m_RoundCounter = 1;

    constructor(roundDuration, roundRestTime, numberOfRounds, currentState)
    {
        this.m_RoundDuration = roundDuration;
        this.m_RoundRestTime = roundRestTime;
        this.m_NumberOfRounds = numberOfRounds;
        this.m_CurrentState = currentState;
    }

    Tick()
    {
        // WORK TIMER RUNNING STATE
        switch (this.m_CurrentState)
        {
            case StateManager.INITIALSTATE:
                this.InitializeTimer();
                break;

            case StateManager.WORKRUNNING:
                this.m_RemainingTime--;
                timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
                if (this.m_RemainingTime <= 0)
                {
                    this.PlayAudio(roundEndSound);
                }
                if (this.m_RemainingTime <= 0)
                {
                    this.m_CurrentState = StateManager.RESTRUNNING;
                }
                break;

            case StateManager.RESTRUNNING:
                this.m_RemainingRestTime--;
                timerLabel.textContent = TimerLabelText.RESTTXT;
                timerDisplay.textContent = this.FormatTimerText(this.m_RemainingRestTime);
                if (this.m_RemainingRestTime <= 0 && this.m_RoundCounter < this.m_NumberOfRounds)
                {
                    this.m_CurrentState = StateManager.RESETTIMER;
                }
                if (this.m_RemainingRestTime == 0 && this.m_RoundCounter == this.m_NumberOfRounds)
                {
                    this.m_CurrentState = StateManager.INITIALSTATE;
                }
                break;
            case StateManager.RESETTIMER:
                this.m_RoundCounter++;
                this.m_RemainingRestTime = this.m_RoundRestTime;
                this.m_RemainingTime = this.m_RoundDuration;
                this.m_CurrentState = StateManager.WORKRUNNING;
                this.PlayAudio(roundStartSound);
                break;
        }
    }



    InitializeTimer()
    {
        clearInterval(timerInterval);
        this.m_RoundCounter = 1;
        this.m_RemainingTime = this.m_RoundDuration;
        this.m_RemainingRestTime = this.m_RoundRestTime;
        timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
        timerLabel.textContent = TimerLabelText.IDLETXT;
    }

    StartTimer()
    {
        this.m_CurrentState = StateManager.WORKRUNNING;
        this.PlayAudio(roundStartSound);
        timerInterval = setInterval(() => this.Tick(), 1000);
    }
    PauseTimer() {}

    ResumeTimer() {}

    ResetTimer() {}

    FormatTimerText(remainingTime)
    {
        let minutes;
        let seconds;

        minutes = Math.floor(remainingTime / 60);
        seconds = remainingTime % 60;

        let formattedMinutes = String(minutes).padStart(2, '0');
        let formattedSeconds = String(seconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    }

    PlayAudio(audioSource, ...index)
    {
        if (audioSource == [])
        {
            audioSource[i].play();
        }
        else
        {
            audioSource.play();
        }
    }
}

const newTimer = new Timer(2, 2, 1, StateManager.INITIALSTATE);
newTimer.InitializeTimer();
console.log('# of Rounds: ' + newTimer.m_NumberOfRounds);
setInterval(() => {
    console.log(newTimer.m_CurrentState);
}, 5000);

startButton.addEventListener('click', () => newTimer.StartTimer());
pauseButton.addEventListener('click', () => newTimer.PauseTimer());
resumeButton.addEventListener('click', () => newTimer.ResumeTimer());
resetButton.addEventListener('click', () => newTimer.ResetTimer());
