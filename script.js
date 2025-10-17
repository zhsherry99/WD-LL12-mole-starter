// DOM SELECT ELEMENTS
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const moleCountDisplay = document.getElementById("moleCount");
const startButton = document.getElementById("startButton");

// Initialize game board
function initializeGame() {
  // Create a mole element inside each hole and add a click handler
  holes.forEach(function (hole) {
    const mole = document.createElement("div");
    mole.className = "mole";

    // When the mole is clicked, count it as a whack if it is currently up
    mole.addEventListener("click", function handleWhack(event) {
      // Stop the click from bubbling
      event.stopPropagation();
      // Only count the whack if the mole is visible (has class 'up')
      if (mole.classList.contains("up")) {
        incrementScore();
        // Hide the mole after whack
        mole.classList.remove("up");
      }
    });

    hole.appendChild(mole);
  });
}

startButton.addEventListener("click", startGame);
initializeGame();

// --------- Scoring and game behavior ---------
// Score value
let score = 0;

// Keyboard grid mapping (rows left-to-right)
const keyGrid = [
  ["r", "t", "y"],
  ["f", "g", "h"],
  ["v", "b", "n"],
];

// Convert a key (like 'r') to a hole index (0..8) or -1 if not found
function keyToHoleIndex(key) {
  // Normalize to lower-case
  const k = String(key).toLowerCase();
  for (let row = 0; row < keyGrid.length; row += 1) {
    for (let col = 0; col < keyGrid[row].length; col += 1) {
      if (keyGrid[row][col] === k) {
        // row-major index: row * number_of_columns + col
        return row * keyGrid[row].length + col;
      }
    }
  }
  return -1;
}

// When a mapped key is pressed, attempt to whack the mole in that hole
document.addEventListener("keydown", function handleKey(event) {
  const index = keyToHoleIndex(event.key);
  if (index < 0) return;
  const hole = holes[index];
  if (!hole) return;
  const mole = hole.querySelector(".mole");
  if (!mole) return;
  // If the mole is up, count a whack and hide it
  if (mole.classList.contains("up")) {
    incrementScore();
    mole.classList.remove("up");
  }
});

// Update the score shown in the DOM
function updateScoreDisplay() {
  if (scoreDisplay) {
    scoreDisplay.textContent = String(score);
  }
}

// Increment the score and update UI
function incrementScore() {
  score += 1;
  updateScoreDisplay();
}

// Pick a random hole index
function randomHoleIndex() {
  return Math.floor(Math.random() * holes.length);
}

// Show a mole for a short time
function showRandomMole() {
  const index = randomHoleIndex();
  const hole = holes[index];
  if (!hole) return;
  const mole = hole.querySelector(".mole");
  if (!mole) return;

  // Make the mole visible
  mole.classList.add("up");

  // Hide after a short duration (unless whacked already)
  setTimeout(function hide() {
    mole.classList.remove("up");
  }, 800);
}

let gameInterval = null;

// Start the game: reset score and begin popping moles
function startGame() {
  // Reset score and update UI
  console.log("Game started");
  score = 0;
  updateScoreDisplay();

  // Clear any existing interval
  if (gameInterval) {
    clearInterval(gameInterval);
  }

  // Show a mole periodically
  gameInterval = setInterval(showRandomMole, 700);
}

// Ensure the initial score is displayed
updateScoreDisplay();
