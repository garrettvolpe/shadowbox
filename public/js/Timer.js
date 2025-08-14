const timerDisplay = document.getElementById('time');
const timerLabel = document.getElementById('timer-label');
const startButton = document.getElementById('start-Btn');
const pauseButton = document.getElementById('pause-Btn');
const resumeButton = document.getElementById('resume-Btn');
const resetButton = document.getElementById('reset-Btn');
const settingButton = document.getElementById('setting-Btn');


const StateManager =
    Object.freeze({INITIALSTATE: 0, WORKRUNNING: 1, RESTRUNNING: 2, NEXTROUND: 3, PAUSEROUND: 4, RESUMEROUND: 5});

const TimerLabelText = Object.freeze({
    IDLETXT: 'ARE YOU READY?',
    RUNNINGTXT: 'WORK',
    RESTTXT: 'REST',
});

const FontColor = Object.freeze({GREEN: '#6FCF97', RED: '#E57373', DEFUALT: '#e6e1d8'});


const ComboAudio = [
    new Audio('./audio/basics/basic1.mp3'),
    new Audio('./audio/basics/basic3.mp3'),
    new Audio('./audio/basics/basic4.mp3'),
    new Audio('./audio/combos/1,2,knee.mp3')

];

const SaveSetting = {
    savedRoundDurationMins: localStorage.getItem('saved-duration'),
    savedRestTimeMins: localStorage.getItem('saved-rest-time'),
    savedNumberOfRounds: localStorage.getItem('saved-round-amount'),
    savedIsSoundOn: localStorage.getItem('save-sound-on'),


    ConvertToSeconds(duration) {
        return duration * 60;
    }
}

const roundStartSound = new Audio('./audio/misc/bell_start.mp3');
const roundEndSound = new Audio('./audio/misc/bell_end.mp3');
const maxClickAllowed = 1;

let timerInterval;
let comboInterval;
let randomIndex;
let currentClickCount;
let savedDurationSeconds;
let savedRestTimeSeconds;
let savedNumberOfRounds;


/*                      ////////// Timer Class Formatting //////////
        -- Any variable with m_[VariableName] is a member of the class and
        cannot be used outside the scope of said class.
*/
class Timer
{
    m_RoundCounter = 1;
    m_CurrentTimeRemaing = 0;
    m_CurrnentRestTimeRemaining = 0;
    m_CurrentRound = 1;

    constructor(roundDuration, roundRestTime, numberOfRounds, currentState)
    {
        this.m_RoundDuration = roundDuration;
        this.m_RoundRestTime = roundRestTime;
        this.m_NumberOfRounds = numberOfRounds;
        this.m_CurrentState = currentState;
    }

    InitializeTimer()
    {
        currentClickCount = 0;
        timerDisplay.style.color = FontColor.DEFUALT;
        startButton.classList.remove('hidden');
        resumeButton.classList.add('hidden');
        pauseButton.classList.add('hidden');
        this.m_RandomIndex = 0;
        this.m_RoundCounter = 1;
        this.m_RemainingTime = this.m_RoundDuration;
        this.m_RemainingRestTime = this.m_RoundRestTime;
        timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
        timerLabel.textContent = TimerLabelText.IDLETXT;
        clearInterval(timerInterval);
    }

    StartTimer()
    {
        currentClickCount = 0;
        if (this.m_CurrentState == StateManager.INITIALSTATE)
        {
            timerDisplay.style.color = FontColor.GREEN;
            startButton.classList.add('hidden');
            pauseButton.classList.remove('hidden');
            this.PlayAudio(roundStartSound);
            this.m_CurrentState = StateManager.WORKRUNNING;
            timerInterval = setInterval(() => this.TimerStateManager(), 1000);
        }
        this.CheckClickCount();
    }
    HandleWorkTimer()
    {
        randomIndex = Math.floor(Math.random() * ComboAudio.length);
        this.m_RemainingTime--;
        timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
        timerLabel.textContent = TimerLabelText.RUNNINGTXT;
        this.HandleComboCalls(randomIndex);
        if (this.m_RemainingTime <= 0)
        {
            this.PlayAudio(roundEndSound);
        }
        if (this.m_RemainingTime <= 0)
        {
            this.m_CurrentState = StateManager.RESTRUNNING;
        }
    }

    HandleResetTimer()
    {
        timerDisplay.style.color = FontColor.RED;
        this.m_RemainingRestTime--;
        timerLabel.textContent = TimerLabelText.RESTTXT;
        timerDisplay.textContent = this.FormatTimerText(this.m_RemainingRestTime);
        if (this.m_RemainingRestTime <= 0 && this.m_RoundCounter < this.m_NumberOfRounds)
        {
            this.m_CurrentState = StateManager.NEXTROUND;
            timerDisplay.style.color = FontColor.GREEN;
        }
        if (this.m_RemainingRestTime == 0 && this.m_RoundCounter == this.m_NumberOfRounds)
        {
            this.m_CurrentState = StateManager.INITIALSTATE;
        }
    }


    HandleNextRound()
    {
        this.m_RoundCounter++;
        this.m_RemainingTime = this.m_RoundDuration;
        this.m_RemainingRestTime = this.m_RoundRestTime;
        timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
        timerLabel.textContent = TimerLabelText.RUNNINGTXT;
        this.PlayAudio(roundStartSound);
        this.m_CurrentState = StateManager.WORKRUNNING;
    }

    HandlePauseRound()
    {
        timerDisplay.style.color = 'GRAY';
        this.m_CurrentTimeRemaing = this.m_RemainingTime;
        this.m_CurrnentRestTimeRemaining = this.m_RemainingRestTime;
        this.m_CurrentRound = this.m_RoundCounter;
        console.log(this.m_CurrentTimeRemaing);
        clearInterval(timerInterval);
        pauseButton.classList.add('hidden');
        resumeButton.classList.remove('hidden');
    }

    HandleComboCalls(randomIndex)
    {
        this.PlayAudio(ComboAudio[randomIndex]);
    }

    PauseTimer()
    {
        currentClickCount++;
        if (this.m_CurrentState != StateManager.PAUSEROUND)
        {
            this.m_CurrentState = StateManager.PAUSEROUND;
            currentClickCount = 0;
        }
        this.CheckClickCount();
    }

    ResumeTimer()
    {
        currentClickCount++;
        console.log(currentClickCount);
        if (this.m_CurrentState == StateManager.PAUSEROUND)
        {
            timerDisplay.style.color = FontColor.GREEN;
            this.m_RemainingTime = this.m_CurrentTimeRemaing;
            this.m_RemainingRestTime = this.m_CurrnentRestTimeRemaining;
            this.m_RoundCounter = this.m_CurrentRound;
            this.m_CurrentState = StateManager.WORKRUNNING;
            timerInterval = setInterval(() => this.TimerStateManager(), 1000);
            console.log(this.m_RoundCounter);
            currentClickCount = 0;
            pauseButton.classList.remove('hidden');
            resumeButton.classList.add('hidden');
        }
        this.CheckClickCount();
    }

    ResetTimer()
    {
        currentClickCount++;
        if (this.m_CurrentState != StateManager.INITIALSTATE)
        {
            currentClickCount = 0;
            this.InitializeTimer();
            this.m_CurrentState = StateManager.INITIALSTATE;
        }
        this.CheckClickCount();
    }

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

    PlayAudio(audioSource)
    {
        audioSource.play();
    }

    TimerStateManager()
    {
        // WORK TIMER RUNNING STATE
        switch (this.m_CurrentState)
        {
            case StateManager.INITIALSTATE:
                randomIndex = 0;
                this.InitializeTimer();
                break;

            case StateManager.WORKRUNNING:
                this.HandleWorkTimer();
                break;

            case StateManager.RESTRUNNING:
                this.HandleResetTimer();
                break;
            case StateManager.NEXTROUND:
                this.HandleNextRound();
                break;

            case StateManager.PAUSEROUND:
                this.HandlePauseRound();
                break;
            case StateManager.RESUMEROUND:
                break;
        }
    }

    CheckClickCount()
    {
        if (currentClickCount > maxClickAllowed)
        {
            alert('PLS STOP, VOLPE SAID IM BAD DEV');
        }
    }
}

function CheckFirstLoad()
{
    if (localStorage.getItem('first-load') == null)
    {
        savedDurationSeconds = SaveSetting.ConvertToSeconds(defaultAmount);
        savedRestTimeSeconds = SaveSetting.ConvertToSeconds(defaultAmount);
        savedNumberOfRounds = defaultAmount;
        localStorage.setItem('first-load', 'true');
        localStorage.setItem('saved-round-amount', defaultAmount);
        localStorage.setItem('saved-duration', defaultAmount);
        localStorage.setItem('saved-rest-time', defaultAmount);
    }
    else
    {
        savedDurationSeconds = SaveSetting.ConvertToSeconds(SaveSetting.savedRoundDurationMins);
        savedRestTimeSeconds = SaveSetting.ConvertToSeconds(SaveSetting.savedRestTimeMins);
        savedNumberOfRounds = SaveSetting.savedNumberOfRounds;
    }
}


CheckFirstLoad();
const newTimer = new Timer(savedDurationSeconds, savedRestTimeSeconds, savedNumberOfRounds, StateManager.INITIALSTATE);
newTimer.InitializeTimer();

startButton.addEventListener('click', () => newTimer.StartTimer());
pauseButton.addEventListener('click', () => newTimer.PauseTimer());
resumeButton.addEventListener('click', () => newTimer.ResumeTimer());
resetButton.addEventListener('click', () => newTimer.ResetTimer());
settingButton.addEventListener('click', function() {
    document.getElementById('config').classList.remove('hidden');
});

DebugTimer(newTimer);

function DebugTimer(timer)
{
    console.log('| Round Duration: ' + timer.m_RoundDuration + ' | Rest Duration: ' + timer.m_RoundRestTime +
                ' | # of Rounds: ' + timer.m_NumberOfRounds + ' |  Round Count: ' + timer.m_RoundCounter + ' | ');
}
