// sound.js
export const clickSound = new Audio("sounds/click.mp3");
export const dingdongSound = new Audio("sounds/dingdong.mp3");

export function playClickSound() {
  clickSound.play();
}

export function playDingdongSound() {
  dingdongSound.play();
}
