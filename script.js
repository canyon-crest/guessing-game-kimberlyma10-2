let answer, guessCount, currentRange;
let totalWins = 0;
const scores = [];
const times = [];
let startTime, timerInterval;

const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const msg = document.getElementById("msg");
const nameInput = document.getElementById("playerName");

function launchConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
        for (let i = 0; i < 5; i++) {
            createConfettiPiece();
        }
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function createConfettiPiece() {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration = (Math.random() * 1 + 1) + "s";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
}

function saveData() {
    localStorage.setItem("wins", totalWins);
    localStorage.setItem("scores", JSON.stringify(scores));
    localStorage.setItem("times", JSON.stringify(times));
}

function loadData() {
    totalWins = parseInt(localStorage.getItem("wins")) || 0;
    const savedScores = JSON.parse(localStorage.getItem("scores"));
    const savedTimes = JSON.parse(localStorage.getItem("times"));
    if (savedScores) scores.push(...savedScores);
    if (savedTimes) times.push(...savedTimes);
}

loadData();

function updateDateTime() {
    const now = new Date();
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const date = now.getDate();

    let suffix = "th";
    if (date % 10 === 1 && date !== 11) suffix = "st";
    else if (date % 10 === 2 && date !== 12) suffix = "nd";
    else if (date % 10 === 3 && date !== 13) suffix = "rd";

    const dateString = `${months[now.getMonth()]} ${date}${suffix}, ${now.getFullYear()} - ${now.toLocaleTimeString()}`;
    document.getElementById("date").textContent = dateString;
}
setInterval(updateDateTime, 1000);
updateDateTime();

function play() {
    const name = nameInput.value || "Player";

    let range = 0;
    let levels = document.getElementsByName("level");

    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) {
            range = parseInt(levels[i].value);
        }
        levels[i].disabled = true;
    }

    currentRange = range;
    answer = Math.floor(Math.random() * range) + 1;
    guessCount = 0;
    startTime = Date.now();

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timerDisplay").textContent = `Current Round: ${elapsed}s`;
    }, 1000);

    msg.textContent = `${name}, guess a number 1-${range}`;

    toggleButtons(true);
}

function makeGuess() {
    const name = nameInput.value || "Player";
    let guess = parseInt(document.getElementById("guess").value);

    if (isNaN(guess)) {
        msg.textContent = `${name}, please enter a valid number`;
        return;
    }

    if (guess < 1 || guess > currentRange) {
        msg.textContent = `${name}, enter a number between 1 and ${currentRange}`;
        return;
    }

    guessCount++;

    if (guess === answer) {
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        msg.textContent = `Correct ${name}! ${guessCount} tries in ${timeTaken}s.`;
        launchConfetti();
        document.body.classList.add("win-glow");
        setTimeout(() => document.body.classList.remove("win-glow"), 1000);
        handleGameOver(guessCount, timeTaken);
    } else {
        const diff = Math.abs(guess - answer);

        let proximity = "";
        if (diff <= currentRange * 0.02) proximity = " (🔥 SUPER HOT)";
        else if (diff <= currentRange * 0.05) proximity = " (Hot!)";
        else if (diff <= currentRange * 0.1) proximity = " (Warm)";
        else proximity = " (Cold)";

        let direction = guess < answer ? "Too low" : "Too high";

        msg.textContent = `${name}, that is ${direction}${proximity}`;

        document.body.classList.add("shake");
        setTimeout(() => document.body.classList.remove("shake"), 300);

        if (guessCount % 5 === 0) {
            const hint = answer % 2 === 0 ? "even" : "odd";
            msg.textContent += ` | Hint: The number is ${hint}`;
        }
    }

    document.getElementById("guess").value = "";
}

giveUpBtn.addEventListener("click", () => {
    msg.textContent = `The answer was ${answer}. Score set to ${currentRange}.`;
    handleGameOver(currentRange, 0);
});

function handleGameOver(score, time) {
    clearInterval(timerInterval);

    totalWins++;
    scores.push(score);
    if (time > 0) times.push(time);

    saveData();

    updateStats();
    toggleButtons(false);
}

function updateStats() {
    document.getElementById("wins").textContent = "Total wins: " + totalWins;

    const avgScore = scores.length > 0
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        : 0;

    document.getElementById("avgScore").textContent = "Average Score: " + avgScore;

    let fastestVal = 0;
    let avgTimeVal = 0;

    if (times.length > 0) {
        fastestVal = Math.min(...times);
        avgTimeVal = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
    }

    document.getElementById("fastest").textContent = "Fastest Game: " + fastestVal + "s";
    document.getElementById("avgTime").textContent = "Average Time: " + avgTimeVal + "s";

    const bestScore = scores.length > 0 ? Math.min(...scores) : "---";
    document.getElementById("bestScore").textContent = "Best Score: " + bestScore;

    const sortedScores = [...scores].sort((a, b) => a - b);
    const listItems = document.getElementsByName("leaderboard");

    for (let i = 0; i < 3; i++) {
        listItems[i].textContent = sortedScores[i] !== undefined ? sortedScores[i] : "---";
    }
}

function toggleButtons(isPlaying) {
    guessBtn.disabled = !isPlaying;
    giveUpBtn.disabled = !isPlaying;
    playBtn.disabled = isPlaying;

    if (!isPlaying) {
        document.getElementsByName("level").forEach(l => l.disabled = false);
    }
}

playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);

document.getElementById("guess").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        makeGuess();
    }
});

updateStats();