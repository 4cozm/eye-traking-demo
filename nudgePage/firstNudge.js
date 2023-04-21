const API_KEY = "AIzaSyAbpGHHJR1pWCdRA8amhHXSG6Zt7br3y50";
const endpoint = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&eventType=live&maxResults=1&q=${encodeURIComponent(
  "@BusanLive"
)}`;

fetch(endpoint, { credentials: "include" })
  .then((response) => response.json())
  .then((data) => {
    const liveVideoId = data.items[0].id.videoId;
    console.log(`실시간 방송 ID: ${liveVideoId}`);
    player = new YT.Player("player", {
      videoId: liveVideoId,
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  })
  .catch((error) => console.error(error));

function onPlayerReady(event) {
  // 재생 가능하게 되면 실행
  event.target.playVideo();
}

function onPlayerStateChange(event) {
  // 비디오 상태 변화시 실행
  if (event.data == YT.PlayerState.ENDED) {
    // 비디오가 종료되면 실행
    console.log("비디오 종료됨");
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
