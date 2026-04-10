I added a few abov and beyond features to my game, like confetti : function launchConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;

    (function frame() {
        for (let i = 0; i < 5; i++) {
            createConfettiPiece();
        }
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}
when you win, screen shake on wrong guesses, hints, and saved stats. AI helped me figure out how to code most of the features, especially the animations and local storage. Even so, I still learned how the code works and how to improve the css and experience. 
