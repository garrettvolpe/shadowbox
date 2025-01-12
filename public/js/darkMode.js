document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode); 

//Variables
const body = document.getElementById('body');
const toggleDarkModeImg = document.getElementById('toggle-dark-mode');

//set the theme on initial page load
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }

}

function toggleDarkMode() {
   const savedTheme = localStorage.getItem('theme');
    if(body.classList.contains("dark-mode")){
      localStorage.setItem('theme', 'light');
   }
   else {
      localStorage.setItem('theme', 'dark');
   }
   
   body.classList.toggle('dark-mode');
}


// Set the initial theme when the page loads
setInitialTheme();