document.addEventListener('DOMContentLoaded', preferredThemeMode); 
document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode); 

//Variables
const body = document.getElementById('body');


function preferredThemeMode(){

   let savedTheme = localStorage.getItem('theme'); 
   if(savedTheme = "dark") {
      toggleDarkMode();
   }
   else {
      body.classList.remove('dark-mode');
   }
}


 function toggleDarkMode() {
   
   body.classList.toggle('dark-mode'); //Switches between dark and light mode
   
   if(body.classList.contains("dark-mode")){
      localStorage.setItem('theme', 'dark')
   }
   else{
      
      localStorage.setItem('theme', 'light')
   }
   
}



