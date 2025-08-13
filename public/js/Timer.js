

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
        this.m_RemainingRestTime = this.m_RoundRestTime;
        timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
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
        clearInterval(timerInterval);
        this.InitializeTimer();
    }

    FormatTimerText(remainingTime)
    {
        let minutes; 
        let seconds; 
        
        minutes = Math.floor(remainingTime / 60); 
        seconds = remainingTime % 60;

        let formattedMinutes = String(minutes).padStart(2, "0");
        let formattedSeconds = String(seconds).padStart(2, "0");


        return `${formattedMinutes}:${formattedSeconds}`;
       
    }

    UpdateTimer()
    {
        if(this.m_RemainingTime >= 0)
            {
                timerDisplay.textContent = this.FormatTimerText(this.m_RemainingTime);
                this.m_RemainingTime--; 
            }
        else if(this.m_RemainingRestTime != 0)
        {
             timerDisplay.textContent = this.FormatTimerText(this.m_RemainingRestTime);
             this.m_RemainingRestTime--;
        }
        else
         {
            
    
            this.ResetTimer();
        }
    }
}

const newTimer = new Timer(5, 5, 3);
newTimer.InitializeTimer();

startButton.addEventListener("click", () => newTimer.StartTimer());
pauseButton.addEventListener("click", ()=> newTimer.PauseTimer());
resumeButton.addEventListener("click", () => newTimer.ResumeTimer());
resetButton.addEventListener("click", ()=> newTimer.ResetTimer()); 