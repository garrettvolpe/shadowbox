document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode); 

//Variables
const body = document.getElementById('body');


 function toggleDarkMode() {
   
   body.classList.toggle('dark-mode'); //Switches between dark and light mode
   
   if(body.classList.contains("dark-mode")){
      localStorage.setItem('theme', 'dark')
   }
   else {
      localStorage.setItem('theme', 'light')
   }
   
  const savedTheme = localStorage.getItem('theme'); 
  if(savedTheme = "dark") {
   document.body.classList.add('dark-mode')
  }
  else{
   document.body.classList.remove()
  }

   
}

function changeImg(){
   if(isDarkModeEnabled == true){
      document.getElementById("toggle-dark-mode").src = "public/images/light-mode.png";
   }
   else if(isDarkModeEnabled == false){
      document.getElementById("toggle-dark-mode").src="public/images/dark-mode.png";
   }
}