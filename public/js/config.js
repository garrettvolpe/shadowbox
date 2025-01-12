document.getElementById("save-setting-bttn").addEventListener('click', saveSettings); 


let savedNumOfRounds; 
let savedDuration;
let savedRestTime;

//Variables
 function setIntialSettings(){
    savedNumOfRounds = localStorage.getItem('num-rounds')
    savedDuration = localStorage.getItem('round-times')
    savedRestTime = localStorage.getItem('rest-time')

    if(savedRestTime == null){
        localStorage.setItem('num-rounds', 3); 
        localStorage.setItem('round-times', 3); 
        localStorage.setItem('rest-time', 30); 
    }
 }

function saveSettings(){

        let numOfRounds = document.getElementById('rounds').value;
        let roundTime = document.getElementById('round-times').value;
        let restTime = document.getElementById('rest-time').value;
        localStorage.setItem('num-rounds', numOfRounds);
        localStorage.setItem('round-times', roundTime); 
        localStorage.setItem('rest-time', restTime);
}

setIntialSettings();




 