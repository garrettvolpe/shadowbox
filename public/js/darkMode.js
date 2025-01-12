document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode); 

//Variables
const body = document.getElementById('body');
const toggleDarkModeImg = document.getElementById('toggle-dark-mode');

// Function to set the theme on initial page load
function setInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    console.log(savedTheme)
    if (savedTheme === 'dark') {
      console.log("test")
        body.classList.add('dark-mode');
        toggleDarkModeImg.src="images/light-mode.png"
    } else {
         toggleDarkModeImg.src="images/dark-mode.png"
    }

}

function toggleDarkMode() {
   console.log("test")
   const savedTheme = localStorage.getItem('theme');
    if(body.classList.contains("dark-mode")){
      localStorage.setItem('theme', 'light');
        toggleDarkModeImg.src = "images/dark-mode.png"
   }
   else {
      localStorage.setItem('theme', 'dark');
        toggleDarkModeImg.src = "images/light-mode.png"
   }
   
   body.classList.toggle('dark-mode');
}

// Set the initial theme when the page loads
setInitialTheme();