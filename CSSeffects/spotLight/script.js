let body = document.querySelector('body');
let spotlight = document.querySelector('.spotLight');

window.onmousemove = function(e) {
    spotlight.style.top = e.clientY  + 'px';
    spotlight.style.left = e.clientX +'px';
}

//ondbclick = when the user double clicks
body.ondblclick = function(){
    body.classList.toggle('active');
}