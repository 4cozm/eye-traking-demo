const Check3s = document.querySelectorAll('.hover-to-click');

Check3s.forEach(function(Check){
    let isMouseOver = false;
    let clicktimeout;

    Check.addEventListener('mouseover',function(){
        isMouseOver = true;
        clicktimeout = setTimeout(function(){
            handleClick(Check);
        },3000);
    });

    Check.addEventListener('mouseout',function(){
        isMouseOver = false;
        clearTimeout(clicktimeout);
    });

    function handleClick(Check){
        console.log(`마우스가 ${Check.textContent}에 3초 이상 머무름`);
        Check.click();
    }
});

var videos = document.getElementsByClassName("side-bar-video");

Array.from(videos).forEach(function(video){
    video.onended = function(){
        window.location.hash="";
    };
});