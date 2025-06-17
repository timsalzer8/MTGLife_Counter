const players = Array.from(document.querySelectorAll(".player"));
players.forEach(player => console.log("Player geladen:", player.id));

const bloodSound = document.getElementById("bloodSound");
const victorySound = document.getElementById("victorySound");

let defeatedPlayers = 0;
let victoryTriggered = false;

players.forEach((player) => {
  const lifeDisplay = player.querySelector(".life");
  const plusBtn = player.querySelector(".plus");
  const minusBtn = player.querySelector(".minus");

  plusBtn.addEventListener("click", () => {
    console.log("PLUS geklickt für:", player.id);
    let current = parseInt(lifeDisplay.textContent.replace(/[^\d]/g, '')) || 0;
  
    const wasKO = player.classList.contains("ko");
  
    current++;
    lifeDisplay.textContent = current;
    lifeDisplay.style.color = "black";
  
    if (wasKO && current > 0) {
      console.log("KO wird entfernt für:", player.id);
      player.classList.remove("ko");
      defeatedPlayers--;
  
      const blood = player.querySelector(".blood-splash");
      if (blood) blood.classList.remove("active");
  
      if (victoryTriggered) {
        victoryTriggered = false;
        const crowns = document.querySelectorAll(".victory-frame");
        crowns.forEach(c => c.classList.remove("active"));
      }
    }
  
    checkWinner();
  });
  
  minusBtn.addEventListener("click", () => {
    console.log("MINUS geklickt für:", player.id);
    let current = parseInt(lifeDisplay.textContent.replace(/[^\d]/g, '')) || 0;
  
    if (current > 0) {
      current--;
      lifeDisplay.textContent = current;
  
      if (current === 0) {
        handleDefeat(player);
        player.classList.add("ko");
      } else {
        player.classList.remove("ko");
      }
  
      checkWinner();
    }
  });
});
  
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  defeatedPlayers = 0;
  victoryTriggered = false;

  players.forEach((player) => {
    const lifeDisplay = player.querySelector(".life");
    lifeDisplay.textContent = 40;
    lifeDisplay.style.color = "black";
    player.classList.remove("ko", "winner");

    const blood = player.querySelector(".blood-splash");
    const crown = player.querySelector(".victory-frame");
    if (blood) blood.classList.remove("active");
    if (crown) crown.classList.remove("active");
  });
});

function handleDefeat(player) {
  const blood = player.querySelector(".blood-splash");
  if (blood) {
    blood.classList.remove("active");
    void blood.offsetWidth;
    blood.classList.add("active");
  }

  defeatedPlayers++;

  if (defeatedPlayers < 3) {
    if (bloodSound && typeof bloodSound.play === "function") {
      bloodSound.currentTime = 0;
      bloodSound.play().catch(e => console.warn("Blood sound failed:", e));
    }
  }
}

function checkWinner() {
  const aliveIDs = new Set();

  players.forEach((player) => {
    const life = parseInt(player.querySelector(".life").textContent.replace(/[^\d]/g, '')) || 0;
    if (life > 0) {
      aliveIDs.add(player.id);
    }
  });

  console.log("Lebende Spieler (IDs):", Array.from(aliveIDs));
  console.log("VictoryTriggered:", victoryTriggered);

  if (aliveIDs.size === 1 && !victoryTriggered) {
    victoryTriggered = true;

    const winnerID = Array.from(aliveIDs)[0];
    const winner = players.find(p => p.id === winnerID);

    console.log("Victory triggered!");
    console.log("Winner:", winner.id);

    players.forEach(p => p.classList.remove("winner"));
    winner.classList.remove("winner");
    void winner.offsetWidth;
    winner.classList.add("winner");

    const crown = winner.querySelector(".victory-frame");
    if (crown) crown.classList.add("active");

    victorySound.currentTime = 0;
    setTimeout(() => {
      victorySound.play().then(() => {
        console.log("Victory Sound wurde abgespielt.");
      }).catch(e => console.warn("Victory Sound failed:", e));
    }, 100);
  } else {
    players.forEach(p => p.classList.remove("winner"));
  }
}