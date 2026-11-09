const gridContainer = document.getElementById('gridContainer');
const movesDisplay = document.getElementById('movesDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const bestDisplay = document.getElementById('bestDisplay');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const overText = document.getElementById('overText');

const icons = ['🛸', '🤖', '👾', '🚀', '🔮', '⚡', '🔋', '💎'];
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matchesFound = 0;
let seconds = 0;
let timerInterval = null;
let bestMoves = localStorage.getItem('cyberMatrix_best') || 0;

bestDisplay.innerText = bestMoves;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  gridContainer.innerHTML = '';
  const deck = shuffle([...icons, ...icons]);

  deck.forEach((icon) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.icon = icon;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${icon}</div>
      </div>
    `;

    card.addEventListener('click', flipCard);
    gridContainer.appendChild(card);
  });
}

function flipCard() {
  if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

  this.classList.add('flipped');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.innerText = moves;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.icon === secondCard.dataset.icon;
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  resetCards();
  matchesFound++;

  if (matchesFound === icons.length) {
    endGame();
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    if (firstCard) firstCard.classList.remove('flipped');
    if (secondCard) secondCard.classList.remove('flipped');
    resetCards();
  }, 900);
}

function resetCards() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function startTimer() {
  seconds = 0;
  timerDisplay.innerText = '0s';
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    seconds++;
    timerDisplay.innerText = `${seconds}s`;
  }, 1000);
}

function startGame() {
  moves = 0;
  matchesFound = 0;
  movesDisplay.innerText = moves;

  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');

  createBoard();
  startTimer();
}

function endGame() {
  clearInterval(timerInterval);

  if (bestMoves === 0 || moves < bestMoves) {
    bestMoves = moves;
    localStorage.setItem('cyberMatrix_best', bestMoves);
    bestDisplay.innerText = bestMoves;
  }

  overText.innerHTML = `Completed in <b>${moves}</b> moves & <b>${seconds}</b> seconds!`;
  gameOverScreen.classList.remove('hidden');
}