///////////////////////////////////////////////////////
/// import helpers
///////////////////////////////////////////////////////
import * as helpers from "./helpers.js";

///////////////////////////////////////////////////////
/// DOM ELEMENTS SELECTIONS
///////////////////////////////////////////////////////

const startButton = document.querySelector(".start-screen button");
const difficultyDropdown = document.getElementById("difficulty");
const nameInput = document.getElementById("user-name");
const nameEl = document.querySelector(".information-container .name");
const difficultyEl = document.querySelector(
  ".information-container .difficulty"
);
const startScreen = document.querySelector(".start-screen");
const cardsContainer = document.querySelector(".cards-container");
const remaininTriesEl = document.querySelector(".remaining-tries span");
const successSound = document.getElementById("success");
const cardsArray = [...cardsContainer.querySelectorAll(".card")];
const endScreen = document.querySelector(".end-screen");
const playAgainBtn = endScreen.querySelector("button");

///////////////////////////////////////////////////////
/// GLOBAL VARIABLES
///////////////////////////////////////////////////////
let difficulty = difficultyDropdown.value,
  userName,
  tries,
  orderRange = [...Array(cardsArray.length).keys()],
  numOfMatchedCards = 0;
const duration = 1000;
// Options for the observer (which mutations to observe)
const observerConfig = { childList: true };

///////////////////////////////////////////////////////
/// EVENT LISTENERS
///////////////////////////////////////////////////////

playAgainBtn.addEventListener("click", () => {
  window.location.reload();
});

difficultyDropdown.addEventListener("change", (event) => {
  difficulty = event.target.value;
});

nameInput.addEventListener("input", (event) => {
  userName = event.target.value;
});

startScreen.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!userName || !difficulty) return;
  //assiging tries variable according to difficulty
  if (difficulty === "easy") {
    tries = 100;
  }
  if (difficulty === "intermediate") {
    tries = 30;
  }
  if (difficulty === "difficult") {
    tries = 15;
  }

  //displaying user data
  startScreen.remove();
  remaininTriesEl.textContent = tries;
  nameEl.textContent = userName;
  difficultyEl.textContent = difficulty;
  //randomize order range array
  orderRange = helpers.randomize(orderRange);
  //randomly displaing elements
  cardsArray.forEach((el, i) => {
    el.style.order = orderRange[i];
  });
});

cardsContainer.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  card.classList.add("isRotated");
  let allRotatedCards = cardsArray.filter((card) =>
    card.classList.contains("isRotated")
  );
  if (allRotatedCards.length === 2) {
    helpers.stopClicking(cardsContainer);
    checkMatch(allRotatedCards[0], allRotatedCards[1]);
  }
});

///////////////////////////////////////////////////////
/// DOM REMAINING TRIES CHANGE OBSERVER WITH CALLBACK
///////////////////////////////////////////////////////

// Callback function to execute when mutations are observed
const winLossCallback = function () {
  const remaining = parseInt(remaininTriesEl.innerHTML);
  const winText = `Great Job ${userName} you won the game 🎉🎉💪 you Score is ${tries} in the ${difficulty} level!`;
  const lossText = `unfortunately ${userName} you lost the game 😭😭😭 try again later!`;
  if (remaining > 0) {
    if (numOfMatchedCards === 20) {
      endScreen.classList.remove("hidden");
      endScreen.querySelector("div").textContent = winText;
    }
  } else {
    endScreen.classList.remove("hidden");
    endScreen.querySelector("div").textContent = lossText;
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(winLossCallback);

// Start observing the target node for configured mutations
observer.observe(remaininTriesEl, observerConfig);

///////////////////////////////////////////////////////
/// CHECK MATCH FUNCTION
///////////////////////////////////////////////////////

//check matched blocks
function checkMatch(card1, card2) {
  if (card1.dataset.identifier === card2.dataset.identifier) {
    card1.classList.remove("isRotated");
    card2.classList.remove("isRotated");
    card1.classList.add("isMatched");
    card2.classList.add("isMatched");
    successSound.play();
    numOfMatchedCards += 2;
    winLossCallback();
  } else {
    tries--;
    remaininTriesEl.textContent = tries;
    setTimeout(() => {
      card1.classList.remove("isRotated");
      card2.classList.remove("isRotated");
    }, duration);
  }
}
