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
  
    player.classList.remove("ko", "winner");

    const blood = player.querySelector(".blood-splash");
    const crown = player.querySelector(".victory-frame");
    if (blood) blood.classList.remove("active");
    if (crown) crown.classList.remove("active");
  });
});

function handleDefeat(player) {
  const blood = player.querySelector(".blood-splash");
  const splatterContainer = player.querySelector(".blood-splatter-container");

  if (blood) {
    blood.classList.remove("active");
    void blood.offsetWidth;
    blood.classList.add("active");
  }

  if (splatterContainer) {
    splatterContainer.innerHTML = "";

    const playerAngles = {
      player1: 280,
      player2: 250,
      player3: 300,
      player4: 250,
    };

    const playerId = player.id;
    const baseAngleDeg = playerAngles[playerId] || 0;
    const baseAngleRad = baseAngleDeg * (Math.PI / 180);

    for (let i = 0; i < 100; i++) {
      const dot = document.createElement("div");
      dot.classList.add("blood-dot");

      const angle = baseAngleRad + (Math.random() - 0.5) * (Math.PI / 2);
      const distance = 500 + Math.random() * 80;

      const x = Math.cos(angle) * distance + "px";
      const y = Math.sin(angle) * distance + "px";

      dot.style.top = "100px";
      dot.style.left = "48%";
      dot.style.transform = "translate(-50%, -50%)";
      dot.style.setProperty("--x", x);
      dot.style.setProperty("--y", y);
      dot.style.width = `${4 + Math.random() * 6}px`;
      dot.style.height = dot.style.width;


      splatterContainer.appendChild(dot);
    }
  }

  player.classList.add("ko");
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

    document.body.classList.add("shake");

    setTimeout(() => {
      document.body.classList.remove("shake");
    }, 1200);

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
  const lightning = document.getElementById("lightning");
lightning.classList.add("flash");

setTimeout(() => {
  lightning.classList.remove("flash");
}, 300);
const arena = document.getElementById("game-arena");

arena.classList.add("shake-wave");

setTimeout(() => {
  arena.classList.remove("shake-wave");
}, 3500);
}

const overlay = document.getElementById("name-overlay");
const nameInput = document.getElementById("name-input");
const confirmBtn = document.getElementById("name-confirm");

let currentPlayerNameDiv = null;

document.querySelectorAll(".player-name").forEach(nameDiv => {
  nameDiv.addEventListener("click", () => {
    currentPlayerNameDiv = nameDiv;
    nameInput.value = nameDiv.textContent.trim();
    overlay.classList.remove("hidden");
    nameInput.focus();
  });
});

confirmBtn.addEventListener("click", () => {
  console.log("OK-Button wurde geklickt!");
  const name = nameInput.value.trim();
  if (currentPlayerNameDiv) {
    currentPlayerNameDiv.textContent = name || currentPlayerNameDiv.dataset.placeholder || "Player";
  }
  overlay.classList.add("hidden");
  console.log("Overlay sollte jetzt ausgeblendet sein.");
});