document.getElementById("save-setting-bttn").addEventListener('click', saveSettings); 


let saveNumOfRounds; 
let savedDuration;
let savedRestTime;

//Variables
 function setIntialSettings(){
    saveNumOfRounds = localStorage.getItem('num-rounds')
    savedDuration = localStorage.getItem('round-time')
    savedRestTime = localStorage.getItem('rest-time')

    if(saveNumOfRounds == null){
        localStorage.setItem('num-rounds', 3); 
        localStorage.setItem('round-times', 3); 
        localStorage.setItem('rest-time', 30); 
    }
 }

function saveSettings(){

        let numOfRounds = document.getElementById('rounds').value;
        let roundTime = document.getElementById('round-time').value;
        let restTime = document.getElementById('rest-time').value;
        localStorage.setItem('num-rounds', numOfRounds);
        localStorage.setItem('round-times', roundTime); 
        localStorage.setItem('rest-time', restTime);
}

setIntialSettings();




 