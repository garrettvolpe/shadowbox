document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode); 

//Variables
const bodyStyle = document.getElementById('body');
const leftContainer = document.getElementById('left-container'); 
const rightContainer = document.getElementById('right-container'); 
const footerContainer = document.getElementById('footer-container'); 


let isDarkModeEnabled = false; 

 //When clicked toggle dark mode
function toggleDarkMode() {
    bodyStyle.classList.toggle("dark-mode");
    leftContainer.classList.toggle("dark-mode");
    rightContainer.classList.toggle("dark-mode");
    footerContainer.classList.toggle("dark-mode");
}

function changeImg(){
   if(isDarkModeEnabled == true){
      document.getElementById("toggle-dark-mode").src = "/images/light-mode.png";
   }
   else if(isDarkModeEnabled == false){
      document.getElementById("toggle-dark-mode").src="/images/dark-mode.png";
   }
}