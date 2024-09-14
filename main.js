// variables
const gameTitle = "Guess The Word";
const triesCount = 6;
const wordsLength = 6;
let currentTry = 1;

// setting up the header and the footer UI
document.querySelector("header").innerHTML = gameTitle;
document.querySelector("footer").innerHTML =
  `${gameTitle} Game Created By<a target="_blank" href="https://github.com/Muhammad95959">Muhammad Hefzey</a>`;

// setting up game-field UI
const gameInputs = document.querySelector(".game-inputs");
for (let i = 1; i <= triesCount; i++) {
  const div = document.createElement("div");
  div.classList.add("try");
  div.textContent = `Try ${i}`;
  for (let j = 1; j <= wordsLength; j++) {
    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 1;
    input.classList.add(`letter-${i}-${j}`);
    if (i !== currentTry) input.disabled = true;
    div.appendChild(input);
  }
  i !== currentTry && div.classList.add("disabled");
  gameInputs.appendChild(div);
}
