let answer, guessCount, currentRange;
let totalWins = 0;
let scores = [];
let times = [];
let startTime, timerInterval;

const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const msg = document.getElementById("msg");
const nameInput = document.getElementById("playerName");

function updateDateTime() {
    const now = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = now.getDate();

    let suffix = "th";
    if (d % 10 === 1 && d !== 11) suffix = "st";
    else if (d % 10 === 2 && d !== 12) suffix = "nd";
    else if (d % 10 === 3 && d !== 13) suffix = "rd";

    const str = `${months[now.getMonth()]} ${d}${suffix}, ${now.getFullYear()} - ${now.toLocaleTimeString()}`;
    document.getElementById("date").textContent = str;
}
setInterval(updateDateTime, 1000);
updateDateTime();

function play() {
    const name = nameInput.value || "John";

    let levels = document.getElementsByName("level");
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) currentRange = parseInt(levels[i].value);
        levels[i].disabled = true;
    }

    answer = Math.floor(Math.random() * currentRange) + 1;
    guessCount = 0;
    startTime = Date.now();

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const t = Math.floor((Date.now() - startTime)/1000);
        document.getElementById("timerDisplay").textContent = t;
    },1000);

    msg.textContent = name + ", guess a number 1-" + currentRange;

    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    playBtn.disabled = true;
}

function makeGuess() {
    const name = nameInput.value || "John";
    let guess = parseInt(document.getElementById("guess").value);

    if (isNaN(guess)) return;

    guessCount++;

    if (guess === answer) {
        let time = Math.floor((Date.now() - startTime)/1000);
        msg.textContent = "Correct " + name;
        handleGameOver(guessCount, time);
        return;
    }

    let direction = guess > answer ? "Too high" : "Too low";

    let diff = Math.abs(guess - answer);
    let proximity = "";
    if (diff <= 2) proximity = " hot";
    else if (diff <= 5) proximity = " warm";
    else proximity = " cold";

    msg.textContent = name + ", " + direction + proximity;
}

giveUpBtn.addEventListener("click", () => {
    msg.textContent = "The answer was " + answer;
    handleGameOver(currentRange, 0);
});

function handleGameOver(score, time) {
    clearInterval(timerInterval);

    totalWins++;
    scores.push(score);
    if (time > 0) times.push(time);

    updateStats();

    guessBtn.disabled = true;
    giveUpBtn.disabled = true;
    playBtn.disabled = false;

    document.getElementsByName("level").forEach(l => l.disabled = false);
}

function updateStats() {
    document.getElementById("wins").textContent = "Total wins: " + totalWins;

    let avg = scores.reduce((a,b)=>a+b,0)/scores.length;
    document.getElementById("avgScore").textContent = "Average Score: " + avg;

    let fastest = times.length ? Math.min(...times) : 0;
    let avgTime = times.length ? times.reduce((a,b)=>a+b,0)/times.length : 0;

    document.getElementById("fastest").textContent = "Fastest Game: " + fastest;
    document.getElementById("avgTime").textContent = "Average Time: " + avgTime;

    let sorted = [...scores].sort((a,b)=>a-b);
    let list = document.getElementsByName("leaderboard");

    for (let i = 0; i < 3; i++) {
        list[i].textContent = sorted[i] !== undefined ? sorted[i] : "---";
    }
}

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);