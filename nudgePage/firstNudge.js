//프록시 서버에서 유튜브 api로 생방송 정보 반환
const proxyUrl = "https://eye-traking-demo-proxy-server.glitch.me/youtube-api";
let liveVideoId;
fetch(proxyUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log("Client received data:", data);
    if (data.items && data.items.length > 0) {
      liveVideoId = data.items[0].id.videoId;
      console.log("Live video ID:", liveVideoId);
      loadVideoById(liveVideoId);
    } else {
      console.log("라이브 방송이 꺼져있어 대체 id 반환");
      // 생방송 중인 동영상이 없는 경우 처리
      liveVideoId = "50P-2N6uex4";
    }
  })
  .catch((error) => {
    console.error("에러발생:", error);
  });

//youtube 영상 재생
function loadVideoById(videoId) {
  const iframe = document.getElementById("youtube");
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

const start = document.querySelector(".start");
const pageOpacity = document.querySelector(".page-opacity");
let pageMoveTimer;
let isTimerOn = false;
let mouseIdleTimer;

function resetMouseIdleTimer() {
  clearTimeout(mouseIdleTimer);
  mouseIdleTimer = setTimeout(() => {
    clearTimeout(pageMoveTimer);
    isTimerOn = false;
    start.style.transition = "opacity 3s ease-in-out";
    start.style.opacity = "0";
    pageOpacity.style.transition = "opacity 3s ease-in-out";
    pageOpacity.style.opacity = "0.2";
  }, 500);
}

document.addEventListener("mousemove", function (event) {
  resetMouseIdleTimer();

  start.style.transition = "opacity 3s ease-in-out";
  start.style.opacity = "1";

  pageOpacity.style.transition = "opacity 3s ease-in-out";
  pageOpacity.style.opacity = "1";

  if (!isTimerOn) {
    pageMoveTimer = setTimeout(function () {
      document.body.style.transform = "scale(3)";
      document.body.style.opacity = "0";
      setTimeout(() => {
        fetch("https://eye-traking-demo-proxy-server.glitch.me/calculateRanks")
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));

        fetch("https://eye-traking-demo-proxy-server.glitch.me/recordActivity")
          .then((response) => response.json())
          .then((data) => console.log(data))
          .catch((error) => console.error("Error:", error));

        window.location.href = "secondNudge.html";
      }, 2000);
    }, 2000);

    isTimerOn = true;
  }
});
