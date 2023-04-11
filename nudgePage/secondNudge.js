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
  isMouseOver = true;
  if (isMouseOver === true) {
    timeout = setTimeout(function () {
      location.href = "../mainPage/main.html";
    }, 2000);
  }
});

button.addEventListener("mouseout", function () {
  isMouseOver = false;
  if (isMouseOver === false) {
    clearTimeout(timeout);
  }
});