window.addEventListener("load", function () {
  const target = document.querySelector("#transition-target");

  target.animate(
    {
      transform: ["scale(1.4)", "scale(1.2)", "scale(1)"],
      opacity: [0, 1],
    },
    {
      duration: 2000,
      easing: "ease-in-out",
      fill: "both",
    }
  );
});
const button = document.querySelector("#eyeTrackingButton");
let isMouseOver = false;
let timeout;

button.addEventListener("mouseover", function () {
  uiMovePlaySound();
  isMouseOver = true;
  console.log("타이머 시작");
  if (isMouseOver === true) {
    timeout = setTimeout(function () {
      buttonPressedPlaySound()
        .then(() => {
          location.href = "../mainPage/main.html";
        })
        .catch((error) => {
          console.log("An error occurred: ", error);
        });
    }, 1000);
  }
});

button.addEventListener("mouseout", function () {
  isMouseOver = false;
  if (isMouseOver === false) {
    clearTimeout(timeout);
  }
});

/*눈알 이모티콘 JS*/
const eyeballs = document.querySelectorAll(".eye-ball");

const moveEye = (event, eye, eyeball) => {
  const eyeRect = eye.getBoundingClientRect();

  const centerX = eyeRect.left + eyeRect.width / 2;
  const centerY = eyeRect.top + eyeRect.height / 2;

  let x = event.clientX - centerX;
  let y = event.clientY - centerY;

  const radius = Math.sqrt(x * x + y * y);
  const maxRadius = 30;

  if (radius > maxRadius) {
    x = (x / radius) * maxRadius;
    y = (y / radius) * maxRadius;
  }

  eyeball.setAttribute("cx", 50 + x);
  eyeball.setAttribute("cy", 50 + y);
};

const resetEyePosition = (eyeball) => {
  eyeball.setAttribute("cx", 50);
  eyeball.setAttribute("cy", 50);
};

eyeballs.forEach((eyeball) => {
  const eye = eyeball.parentElement;

  window.addEventListener("mousemove", (event) => moveEye(event, eye, eyeball));
  window.addEventListener("mouseleave", () => resetEyePosition(eyeball));
});

//글자 색을 랜덤으로 바꿔주는 코드
const colors = ["#E0A55E", "#A1D4C1", "#DE6E74", "#8BA6D3", "#D699C6"];
const nudges = document.querySelectorAll(".nudge");

nudges.forEach((nudge) => {
  nudge.addEventListener("mouseover", () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomDuration = Math.random() * 2000 + 1000; // 1000ms~3000ms

    nudge.style.color = randomColor;
    setTimeout(() => {
      nudge.style.color = "#3D3A36";
    }, randomDuration);
  });
});

function uiMovePlaySound() {
  var sound = document.getElementById("ui-move");
  sound.play();
}

async function buttonPressedPlaySound() {
  var soundSrc = document
    .getElementById("button-pressed")
    .children[0].getAttribute("src");
  var sound = new Audio(soundSrc);
  sound.volume = 0.15;

  sound.play();

  return new Promise((resolve, reject) => {
    sound.onended = () => {
      resolve(true);
    };
    sound.onerror = (error) => {
      reject(error);
    };
  });
}
