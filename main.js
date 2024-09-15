// variables
const gameTitle = "Guess The Word";
const triesCount = 6;
const wordsLength = 6;
let currentTry = 1;
let hints = 2;
let currentWord;
const words = [
  "animal",
  "banana",
  "bottle",
  "bridge",
  "button",
  "castle",
  "cheese",
  "circle",
  "doctor",
  "family",
  "flower",
  "forest",
  "garden",
  "island",
  "jacket",
  "jungle",
  "letter",
  "monkey",
  "mother",
  "orange",
  "pencil",
  "planet",
  "pocket",
  "rabbit",
  "rocket",
  "silver",
  "tomato",
  "tunnel",
  "wizard",
  "yellow",
];

// buttons variables
const checkWordBtn = document.querySelector(".check-word");
const hintsBtn = document.querySelector(".hints");
const playAgainBtn = document.querySelector(".play-again i");

// don't repeat words in the same session
if (window.sessionStorage.getItem("words") === null)
  window.sessionStorage.words = JSON.stringify([]);
window.onload = () => {
  const wordsCount = words.length;
  let usedWords = JSON.parse(window.sessionStorage.words);
  for (w of usedWords) {
    words.splice(words.indexOf(w), 1);
  }
  currentWord = words[Math.floor(Math.random() * words.length)];
  usedWords.push(currentWord);
  if (usedWords.length === wordsCount) {
    window.sessionStorage.words = JSON.stringify([]);
    usedWords = [];
  } else window.sessionStorage.words = JSON.stringify(usedWords);
  // console.log(currentWord); // for debugging
};

// setting up the header and the footer UI
document.querySelector("header").innerHTML = gameTitle;
document.querySelector("footer").innerHTML =
  `${gameTitle} Game Created By<a target="_blank" href="https://github.com/Muhammad95959">Muhammad Hefzey</a>`;

// setting up game-field UI
const gameInputs = document.querySelector(".game-inputs");
for (let i = 1; i <= triesCount; i++) {
  const div = document.createElement("div");
  gameInputs.appendChild(div);
  div.classList.add("try");
  div.textContent = `Try ${i}`;
  i !== currentTry && div.classList.add("disabled");
  for (let j = 1; j <= wordsLength; j++) {
    const input = document.createElement("input");
    div.appendChild(input);
    input.type = "text";
    input.maxLength = 1;
    input.classList.add(`letter-${i}-${j}`);
    if (i !== currentTry) input.disabled = true;
    // input event listeners
    input.addEventListener("input", (e) => {
      if (e.inputType !== "deleteContentBackward") {
        input.value = input.value.toUpperCase();
        let counter = 0;
        while (document.querySelector(`.letter-${i}-${j + 1 + counter}`)?.disabled === true)
          counter++;
        document.querySelector(`.letter-${i}-${j + 1 + counter}`)?.focus();
      }
    });
    input.addEventListener("keydown", (e) => {
      if (
        (e.key === "Backspace" && j > 1 && input.value === "") ||
        (j > 1 && e.key === "ArrowLeft")
      ) {
        let counter = 0;
        while (document.querySelector(`.letter-${i}-${j - 1 - counter}`)?.disabled === true)
          counter++;
        document.querySelector(`.letter-${i}-${j - 1 - counter}`)?.focus();
      } else if (e.key === "ArrowRight" && j < wordsLength) {
        let counter = 0;
        while (document.querySelector(`.letter-${i}-${j + 1 + counter}`)?.disabled === true)
          counter++;
        document.querySelector(`.letter-${i}-${j + 1 + counter}`)?.focus();
      } else if (e.key === "Enter") {
        for (let k = 1; k <= wordsLength; k++) {
          if (document.querySelector(`.letter-${i}-${k}`).value === "") return;
        }
        checkWordBtn.click();
      }
      // because the cursor is put to the left of the letter after clicking ArrowLeft
      if (e.key === "Backspace") input.value = "";
    });
  }
}
document.querySelector(".letter-1-1").focus();

// checkWordBtn event listener
checkWordBtn.addEventListener("click", () => {
  const gameMessage = document.querySelector(".game-message");
  // check if all the inputs are filled
  for (let i = 1; i <= wordsLength; i++) {
    if (document.querySelector(`.letter-${currentTry}-${i}`).value === "") {
      gameMessage.textContent = "";
      setTimeout(() => (gameMessage.textContent = "Complete the word before checking"), 75);
      return;
    }
  }
  gameMessage.textContent = "";
  // disable the current try inputs
  for (let i = 1; i <= wordsLength; i++) {
    const input = document.querySelector(`.letter-${currentTry}-${i}`);
    input.disabled = true;
    if (input.value === currentWord[i - 1].toUpperCase()) {
      input.classList.add("in-place");
    } else {
      let wrong = true;
      for (let j = 0; j < wordsLength; j++) {
        if (input.value === currentWord[j].toUpperCase()) {
          input.classList.add("not-in-place");
          wrong = false;
        }
      }
      if (wrong) input.classList.add("wrong");
    }
  }
  // check if the word is correct
  let correctWord = true;
  for (let i = 1; i <= wordsLength; i++) {
    if (!document.querySelector(`.letter-${currentTry}-${i}`).classList.contains("in-place")) {
      correctWord = false;
      break;
    }
  }
  if (correctWord) {
    gameMessage.textContent = "You Did It, Congratulations!";
    checkWordBtn.disabled = true;
    hintsBtn.disabled = true;
    playAgainBtn.style.display = "block";
    return;
  }
  // enable the next try
  if (currentTry < triesCount) {
    currentTry++;
    document.querySelector(`.try:nth-of-type(${currentTry})`).classList.remove("disabled");
    let focus = false;
    for (let i = 1; i <= wordsLength; i++) {
      const nextInput = document.querySelector(`.letter-${currentTry}-${i}`);
      nextInput.disabled = false;
      if (document.querySelector(`.letter-${currentTry - 1}-${i}`).classList.contains("in-place")) {
        nextInput.value = currentWord[i - 1].toUpperCase();
        nextInput.classList.add("in-place");
        nextInput.disabled = true;
      } else if (!focus) {
        nextInput.focus();
        focus = true;
      }
    }
  } else {
    gameMessage.textContent = `You Lose, The Word Is: ${currentWord}`;
    gameMessage.style.color = "var(--latte-red)";
    playAgainBtn.style.display = "block";
  }
});

// setting HintsBtn textContent
hintsBtn.textContent = `${hints} Hints`;

// hintsBtn envent listener
hintsBtn.addEventListener("click", () => {
  if (hints > 0) {
    let random;
    random = Math.floor(Math.random() * wordsLength);
    while (document.querySelector(`.letter-${currentTry}-${random + 1}`).disabled === true) {
      random = Math.floor(Math.random() * wordsLength);
    }
    const revealed = document.querySelector(`.letter-${currentTry}-${random + 1}`);
    revealed.value = currentWord[random].toUpperCase();
    revealed.classList.add("in-place");
    revealed.disabled = true;
    hints--;
    hintsBtn.textContent = `${hints} Hints`;
    if (hints <= 0) hintsBtn.disabled = true;
  }
});

// playAgainBtn event listener
playAgainBtn.addEventListener("click", () => {
  window.location.reload();
});
