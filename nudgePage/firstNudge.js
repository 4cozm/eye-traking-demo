function onYouTubePlayerAPIReady() {
  player = new YT.Player("youtube", {
    videoId: "qIgk_1NsLKk",
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
}
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    // 비디오가 종료되거나 로드가 안될때
    player.loadVideoById("50P-2N6uex4");
  }
}
const start = document.querySelector(".start");
const pageOpacity = document.querySelector(".page-opacity");
let pageMoveTimer;
let isTimerOn = false;
/*타이머가 여러개 등록되어 claerTimeout이 제대로 작동하지 않는 이슈가 있었음
고로 타이머가 중복 생성되지 않게 하는 코드를 추가 */
document.addEventListener("mousemove", function () {
  start.style.transition = "opacity 3s ease-in-out";
  start.style.opacity = "1";
  //페이지 전체 opacity 조정
  pageOpacity.style.transition = "opacity 3s ease-in-out";
  pageOpacity.style.opacity = "1";
  //타이머 생성 3초후 다음 페이지로 이동함
  if (!isTimerOn) {
    //타이머가 없으면 작동
    pageMoveTimer = setTimeout(function () {
      location.href = "secondNudge.html";
    }, 5000);
    isTimerOn = true;
  }
});
document.addEventListener("mouseout", function () {
  clearTimeout(pageMoveTimer); //타이머 초기화
  isTimerOn = false;
  console.log("마우스 타이머 초기화 됨!");
  start.style.transition = "opacity 3s ease-in-out";
  start.style.opacity = "0";
  //페이지 전체 opacity 조정
  pageOpacity.style.transition = "opacity 3s ease-in-out";
  pageOpacity.style.opacity = "0.2";
});
