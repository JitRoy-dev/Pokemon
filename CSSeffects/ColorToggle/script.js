let toggler = document.getElementById('switch');
toggler.addEventListener("click", () => {
    const toggleSound = new Audio('sounds/sound2.mp3');
    toggleSound.play();  
    toggler.checked === true ? (document.body.style.background = "#c2b828") : (document.body.style.background = "#ffffff");
})
