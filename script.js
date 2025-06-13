const players = document.querySelectorAll(".player");
players.forEach((player) => {
  const lifeDisplay = player.querySelector(".life");
  const plusBtn = player.querySelector(".plus");
  const minusBtn = player.querySelector(".minus");

  plusBtn.addEventListener("click", () => {
    let current = parseInt(lifeDisplay.textContent.replace(/[^\d]/g, '')) || 0;
    current++;
    lifeDisplay.textContent = current;
    lifeDisplay.style.color = "black";
  });

  minusBtn.addEventListener("click", () => {
    let current = parseInt(lifeDisplay.textContent.replace(/[^\d]/g, '')) || 0;
    if (current === 0) return;
    current = Math.max(0, current - 1);
    lifeDisplay.textContent = current;

    if (current === 0) {
      lifeDisplay.textContent = "💀 0";
      lifeDisplay.style.color = "red";
    } else {
      lifeDisplay.style.color = "black";
    }
  });
});

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  players.forEach((player) => {
    const lifeDisplay = player.querySelector(".life");
    lifeDisplay.textContent = 40;
    lifeDisplay.style.color = "black";
  });
});