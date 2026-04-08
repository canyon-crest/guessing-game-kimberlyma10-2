// add javascript here
let guess = 0;
let answer = 0;
let guessCount = 0;
let totalWins = 0;
const scores = [];

document.getElementById("playBtn").addEventListener
document.getElementById("guessBtn").addEventListener("click", makeGuess);
("click", play);
function play(){
    
    let range = 0;
    let levels = document.getElementsByName("level");
    for(let i=0; i<levels.length; i++){
        if(levels[i].checked){
            range = parseInt(levels[i].value);
        }
        levels[i].disabled = true;
    }

    document.getElementById("msg").textContent = 
    "Guess a number 1-" + range;
    answer = Math.floor(Math.random()*range) +1;
    guessCount = 0;

    guessBtn.disabled = false;
    giveUpBtn.disabled = false;
    playBtn.disabled = true;


}
function makeGuess(){
    let guess = parseInt(document.getElementById("guess").value);
    if(isNaN(guess)){
        msg.textContent = "Please enter a valid number";
        return;
    }
    guessCount++;
    if(guess == answer){
        msg.textContent = "Correct! It took " + guessCount + " tries.";
        updateScore(guessCount);
        reset();
    }
    else if (guess < answer){
        msg.textcontent = "Too low, try again!";
    else{
        msg.textContent = "Too high, try again!";
    }

    }
}
function updateScore(score){
    totalWins++;
    scores.push(score);
    wins.textContent = "Total wins: " + totalWins;
}