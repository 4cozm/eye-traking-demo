// 20초간 입력이 없으면 firstNudge로 넘어감
let hoverTimer;
document.addEventListener("mouseover", function () {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  hoverTimer = setTimeout(function () {
    location.href = "../nudgePage/firstnudge.html";
  }, 5000);
});


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



/*
1.마우스가 움직이면 classList.add('nudged')를 추가한다(1회성)
2.마우스가 움직이지 않은 시간을 감지하는 resetTimer를 추가한다.
3.nudged 클래스를 부여 한 후,nudged가 Hover일때 nudged-first클래스를 display:none으로 바꾼다
4.nudged-second를 display:flex속성을 부여한다
5.nudged-sceond에 display:none속성을 부여한다.
6.마우스를 움직이지 않아서 resetTimer가 실행되면 1번 1회성 classList.add를 복구하고 nudged-first,nudged-second를 dispalay:None으로 변경
*/