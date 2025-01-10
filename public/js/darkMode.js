document.getElementById("toggle-dark-mode").addEventListener("click", toggleDarkMode); 

const bodyStyle = document.getElementById('body');
const leftContainer = document.getElementById('left-container'); 
const rightContainer = document.getElementById('right-container'); 
const footerContainer = document.getElementById('footer-container'); 


function toggleDarkMode() {
 //When clicked toggle dark mode
    bodyStyle.classList.add("dark-mode");
    leftContainer.classList.add("dark-mode");
    rightContainer.classList.add("dark-mode");
    footerContainer.classList.add("dark-mode");
}