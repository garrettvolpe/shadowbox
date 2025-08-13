
const timerDisplay = document.getElementById('timer-display');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const resetButton = document.getElementById('reset-button');

//ENUM - JS doesnt have default enumerators //
const TimerState = Object.freeze({
    RUNNING: true,  
    PAUSED: true
});

let timerInterval; 


/*                      ////////// Timer Class Formatting //////////
        -- Any variable with m_[VariableName] is a member of the class and
        cannot be used outside the scope of said class. 
*/ 
class Timer {
    constructor(roundDuration, roundRestTime, numberOfRounds){
        this.m_RoundDuration = roundDuration; 
        this.m_RoundRestTime = roundRestTime; 
        this.m_NumberOfRounds = numberOfRounds;
    }

    InitializeTimer()
    {
        this.m_RemainingTime = this.m_RoundDuration;
        timerDisplay.textContent = this.m_RoundDuration;
    }

    StartTimer()
    {
        timerInterval = setInterval(() => {
           this.UpdateTimer();
        }, 1000);    
    }

    PauseTimer()
    {
        clearTimeout(timerInterval);
    }

    ResumeTimer()
    {
        timerInterval = setInterval(() => {
            this.UpdateTimer();
        }, 1000);
    }

    ResetTimer()
    {
        if(this.m_RemainingTime == 0)
        {
            this.m_RemainingTime = this.m_RoundDuration;
            timerDisplay.textContent = this.m_RemainingTime;
        }
        
    }

    FormatTimerText()
    {
        let minutes; 
        let seconds; 

        minutes /= this.m_RoundDuration; 
        seconds %= this.m_RoundDuration / minutes;
       
    }

    UpdateTimer()
    {
         if(this.m_RemainingTime > 0)
            {
                this.m_RemainingTime--; 
                timerDisplay.textContent = this.m_RemainingTime; 
            }
    }
}

const newTimer = new Timer(10, 60, 3);
newTimer.InitializeTimer();

startButton.addEventListener("click", () => newTimer.StartTimer());
pauseButton.addEventListener("click", ()=> newTimer.PauseTimer());
resumeButton.addEventListener("click", () => newTimer.ResumeTimer());
resetButton.addEventListener("click", ()=> newTimer.ResetTimer()); 