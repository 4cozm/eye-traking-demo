// 5초간 입력이 없으면 firstNudge로 넘어감 다음에 온 사람이 기기를 활용하는 법을 모르면?..
let hoverTimer;
document.addEventListener("mouseover", function () {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  hoverTimer = setTimeout(function () {
    sendVisitData();
    window.location.href = "../nudgePage/firstNudge.html"; //주소가 변경되면 수정해야함
  }, 5000);
});

//hover상태를 유지해서 세부 내용을 보는 페이지
let visited; //마지막으로 방문한 데이터의 JSON파일을 보관/이후 방문자수 집계 데이터로 전달
const waitTimer = 1200; //요소가 클릭 처리 될때까지 걸리는 시간의 총괄

const CheckTime = document.querySelectorAll(".hover-to-click");

CheckTime.forEach(function (Check) {
  let isTimerOn = false;
  let clicktimeout;

  Check.addEventListener("mouseover", function () {
    if (!isTimerOn) {
      isTimerOn = true;
      clicktimeout = setTimeout(() => {
        showExpandedDiv(this);
      }, waitTimer);
    }
  });

  Check.addEventListener("mouseout", function () {
    if (isTimerOn) {
      clearTimeout(clicktimeout);
      isTimerOn = false;
    }
  });
});
//------------------------------
const categoryMapping = {
  "국세 개인 안내": "individual",
  "증명원/서류발급": "certificate",
  "국세 법인 안내": "corporation",
  "세금 카드/납부 방법": "tax-card",
  기타안내: "etc",
};
const cache = {};

async function fetchData(category) {
  if (cache[category]) {
    return cache[category];
  }

  const response = await fetch(
    `https://eye-traking-demo-proxy-server.glitch.me/getData?category=${category}`,
    { credentials: "include" }
  );
  if (!response.ok) {
    console.error(`Failed to fetch data for category: ${category}`);
    return;
  }

  const data = await response.json();
  cache[category] = data;
  return data;
}

async function loadDivData() {
  const listItems = document.querySelectorAll("ul li");

  for (const listItem of listItems) {
    const category = listItem.querySelector("a").textContent.trim();
    const data = await fetchData(categoryMapping[category]);

    if (!data) {
      continue;
    }

    const expandingDiv = listItem.querySelector(".expanded-div");
    expandingDiv.innerHTML = "";

    for (let i = 0; i < data.length; i += 2) {
      const rowDiv = document.createElement("div");

      const firstSpan = createSpanWithHoverEffect(data[i]);
      rowDiv.appendChild(firstSpan);

      if (data[i + 1]) {
        const secondSpan = createSpanWithHoverEffect(data[i + 1]);
        rowDiv.appendChild(secondSpan);
      }

      expandingDiv.appendChild(rowDiv);
    }
  }
}

showExpandedDiv(document.querySelector("#content-1")); //ID정보 삭제예정 다른걸로 바꿔야함
loadDivData();
//---------------
function showExpandedDiv(clickedElement) {
  const siblingElements = Array.from(clickedElement.parentElement.children);
  const clickedElementIndex = siblingElements.indexOf(clickedElement);

  siblingElements.forEach((element, index) => {
    const expandingDiv = element.querySelector(".expanded-div");

    if (element === clickedElement) {
      expandingDiv.classList.remove("hidden");
    } else {
      expandingDiv.classList.add("hidden");
    }

    if (index > clickedElementIndex) {
      element.style.transform = `translateX(${
        clickedElement.querySelector(".expanded-div").offsetWidth * 0.8
      }px)`;
      element.style.transition = "transform 0.3s";
    } else {
      element.style.transform = "none";
      element.style.transition = "transform 0.3s";
    }
  });
}
//----------------
function createSpanWithHoverEffect(data) {
  const span = document.createElement("span");
  span.textContent = data.itemName;
  span.classList.add("expanded-span-content");
  // 전체 JSON 데이터를 데이터셋 속성에 저장합니다
  span.dataset.json = JSON.stringify(data);
  const jsonData = JSON.parse(span.dataset.json); // JSON 데이터를 파싱합니다

  let navigateTimer; // navigateTimer 변수 선언

  // 마우스 오버 이벤트 리스너를 추가합니다
  span.addEventListener("mouseover", function () {
    if (!navigateTimer) {
      navigateTimer = setTimeout(() => {
        const startPosition = this.getBoundingClientRect(); // 요소의 경계 사각형 정보를 가져옵니다
        navigate(jsonData, startPosition); // jsonData와 startPosition을 전달합니다
        visited = jsonData; // visited에 jsonData를 설정합니다
      }, 1000);
    }
  });

  // 마우스 아웃 이벤트 리스너를 추가합니다
  span.addEventListener("mouseout", function () {
    if (navigateTimer) {
      clearTimeout(navigateTimer);
      navigateTimer = null;
    }
  });

  return span;
}

const locationMapping = {
  "1-floor-payment": "1층 셀프결제코너",
  "1-floor-service": "1층 민원봉사실",
  "1-floor-eres": "1층 전자신고센터",
  "1-floor-tax-report": "1층 국세신고안내센터",
  "2-floor-back-taxes": "2층 체납징세과",
  "2-floor-vat": "2층 부가가치세과",
  "2-floor-taxpayer-protection": "2층 납세자보호실",
  "3-floor-income-tax": "3층 소득세과",
  "4-floor-property-corporation": "4층 재산법인세과",
  "5-floor-operation-support": "5층 운영지원팀",
  "6-floor-investigation": "6층 조사과",
  "7-floor-conference-room": "7층 대회의실",
};
const navigatorDiv = document.querySelector(".navigator");
function navigate(jsonData, startPosition) {
  buttonPressedPlaySound();
  // Get the Korean translation of the targetLocation
  const koreanLocation =
    locationMapping[jsonData.targetLocation] || jsonData.targetLocation;

  // Insert the Korean translation of the targetLocation and additional text into the navigatorDiv
  navigatorDiv.textContent = `${koreanLocation}로 방문해주세요`;
  startAnimation();
  // Set the opacity to 0 initially and then change it to 1 after a brief delay
  navigatorDiv.style.opacity = "0";
  setTimeout(() => {
    navigatorDiv.style.opacity = "1";
  }, 100);
  // Create a red ball
  const ball = document.createElement("div");
  ball.style.width = "10px";
  ball.style.height = "10px";
  ball.style.backgroundColor = "red";
  ball.style.position = "fixed";
  ball.style.borderRadius = "50%";
  ball.style.opacity = "0";
  ball.style.transition = "opacity 1s, left 1.5s, top 1.5s";
  document.body.appendChild(ball);

  // Get the start position
  const spanRect = startPosition;
  const startX = spanRect.left + spanRect.width / 2;
  const startY = spanRect.top + spanRect.height / 2;

  // Set the start position and make the ball visible
  ball.style.left = `${startX}px`;
  ball.style.top = `${startY}px`;
  ball.style.opacity = "1";

  // Set the end position to the vertical center and the left edge of the navigatorDiv
  const navigatorDivRect = navigatorDiv.getBoundingClientRect();
  const computedStyle = getComputedStyle(navigatorDiv);
  const paddingTop = parseFloat(computedStyle.paddingTop);
  const paddingLeft = parseFloat(computedStyle.paddingLeft);
  const endX = navigatorDivRect.left + paddingLeft;
  const endY =
    navigatorDivRect.top + paddingTop + navigatorDiv.clientHeight / 2;

  // After a brief delay, move the ball to the end position and then hide it
  setTimeout(() => {
    ball.style.left = `${endX}px`;
    ball.style.top = `${endY}px`;
    setTimeout(() => {
      ball.style.opacity = "0";
      ball.remove(); // remove the ball from the DOM after the animation
    }, 1000);
  }, 100);
}

//--------------------
function startAnimation() {
  navigatorDiv.style.animation = "blink 1.2s linear 2";

  // 1.2s * 4 = 4.8s 후에 애니메이션을 다시 none으로 설정하여 애니메이션이 끝나게 합니다.
  setTimeout(() => {
    navigatorDiv.style.animation = "none";
  }, 4800);
}

//-------------------사이드바의 순위 데이터 설정
fetch("https://eye-traking-demo-proxy-server.glitch.me/ranks", {
  credentials: "include",
})
  .then((response) => response.json())
  .then((data) => {
    const sideBarContainer = document.getElementById("side-bar-item-container");
    sideBarContainer.innerHTML = "";

    data.forEach((item) => {
      const anchor = document.createElement("a");
      anchor.classList.add("side-bar-items", "button-side");
      anchor.textContent = item.itemName;
      anchor.dataset.json = JSON.stringify(item);

      let timerId;
      anchor.addEventListener("mouseenter", function () {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }

        timerId = setTimeout(function () {
          const jsonData = JSON.parse(anchor.dataset.json); // JSON 데이터 추출
          const startPosition = anchor.getBoundingClientRect(); // 요소의 경계 사각형 정보를 가져옴
          navigate(jsonData, startPosition);
          timerId = null; // 타이머 동작이 끝났으므로 null로 설정
        }, waitTimer);
      });

      anchor.addEventListener("mouseleave", function () {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      });

      sideBarContainer.appendChild(anchor);
    });
  })
  .catch((error) => console.error("Error:", error));

//-------------------방문 데이터 전송코드
function sendVisitData() {
  if (!visited) {
    return;
  }

  const itemName = visited.itemName;

  const requestData = {
    itemName: itemName,
  };

  fetch("https://eye-traking-demo-proxy-server.glitch.me/visit", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {})
    .catch((error) => console.error("오류:", error));
}
//사운드 관련
function uiMovePlaySound() {
  var soundSrc = document
    .getElementById("ui-move")
    .children[0].getAttribute("src");
  var sound = new Audio(soundSrc);
  sound.play();
}

function buttonPressedPlaySound() {
  var soundSrc = document
    .getElementById("button-pressed")
    .children[0].getAttribute("src");
  var sound = new Audio(soundSrc);
  sound.volume = 0.15;
  sound.play();
}
