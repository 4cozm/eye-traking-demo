const target = document.getElementById("transition-target");

if (target) {
  // mouseover 이벤트를 감지하여 페이지 전환 애니메이션을 추가
  target.addEventListener("mouseover", function () {
    // View Transitions API를 사용하여 페이지 전환 효과 추가
    target
      .animate(
        {
          transform: ["scale(1)", "scale(1.2)", "scale(1.4)"],
          opacity: [1, 0],
        },
        {
          duration: 2000,
          easing: "ease-in-out",
          fill: "both",
        }
      )
      .addEventListener("finish", function () {
        // 페이지 이동
        window.location.href = "secondNudge.html";
      });
  });
}

// 두 페이지에서 모두 View Transitions API를 사용하여 전환 효과 적용
const secondTarget = document.getElementById("second-transition-target");

if (secondTarget) {
  secondTarget.animate(
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
}
