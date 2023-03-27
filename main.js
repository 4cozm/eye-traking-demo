let divElement = document.querySelector('.side-bar-items');
let isMouseOver = false;
let clickTimeout;

divElement.addEventListener('mouseover',function(){
    isMouseOver = true;
    clickTimeout = setTimeout(function(){
        handleClick();
    },3000);
});

divElement.addEventListener('mouseout',function(){
    isMouseOver = false;
    clearTimeout(clickTimeout);
});

function handleClick(){
    console.log("마우스가 div에 3초이상 머무름");
}

