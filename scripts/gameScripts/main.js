import {animate} from "./animate.js"
import {createBubble} from "./createBubble.js"

const POP_DURATION_MS = 150;

function popBubble(bubble) {
    bubble.newBox.style.transition = `transform ${POP_DURATION_MS}ms ease-out, opacity ${POP_DURATION_MS}ms ease-out`;
    bubble.newBox.style.transform = `translate(${bubble.x}px, ${bubble.y}px) scale(1.25)`;
    bubble.newBox.style.opacity = "0";
    setTimeout(() => bubble.newBox.remove(), POP_DURATION_MS);
}

const params = new URLSearchParams(window.location.search);
const language = params.get("language");
const gameLevel = params.get("level");
startGame(language, gameLevel);

function startGame(language, gameLevel) {
    const bubbleSize = 75;
    let expBubbles = 0;
    const bubbles = [];
    let bubbleCount = 0;
    let timeLeft = 0;
    gameLevel = parseInt(gameLevel);
    switch (gameLevel) {
        case 0: {
            timeLeft = 120;
            bubbleCount = 20;
            break;
        }
        case 1: {
            timeLeft = 100;
            bubbleCount = 40;
            break;
        }
        case 2: {
            timeLeft = 80;
            bubbleCount = 60;
            break;
        }
        case 3: {
            timeLeft = 60;
            bubbleCount = 80;
            break;
        }
        case 4: {
            timeLeft = 40;
            bubbleCount = 60;
            break;
        }
    }
    let remainedBubbles = bubbleCount;

    document.getElementById("expBubbles").innerHTML = expBubbles;
    document.getElementById("remainedBubbles").innerHTML = remainedBubbles;
    document.getElementById("timeSpan").innerHTML = timeLeft;
    
    for (let i = 0; i < bubbleCount; i++) {
        const container = document.getElementById("bubbles-container");
        const bubble = createBubble(bubbleSize, container, language);
        container.appendChild(bubble.newBox);
        bubbles.push(bubble);
    }

    const animateRun = setInterval(animate, 0.1, bubbles, bubbleSize);
    const countDown = setInterval(() => {
        timeLeft --;
        document.getElementById("timeSpan").innerHTML = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countDown);
            if (bubbles.length > 0) {
                clearInterval(animateRun);
                const resultText = document.getElementById("resultText");
                resultText.style.display = "block"
                resultText.style.color = "red";
                resultText.textContent = "You Lose.";
            }
        }
    }, 1000);

    document.addEventListener("keydown", (e) => {
        if (bubbles.length === 0 || timeLeft <= 0) {
            return;
        }
        const selectedKey = e.key;
        for (let i = 0; i < bubbles.length; i++) {
            const b = bubbles[i];
            if (b.letter === selectedKey) {
                popBubble(b);
                bubbles.splice(i, 1);
                expBubbles ++;
                remainedBubbles --;
                break;
            }
        }
        document.getElementById("expBubbles").innerHTML = expBubbles;
        document.getElementById("remainedBubbles").innerHTML = remainedBubbles;
        if (bubbles.length === 0) {
            const resultText = document.getElementById("resultText");
            resultText.style.display = "block"
            resultText.style.color = "green";
            resultText.textContent = "You Win.";
            clearInterval(countDown);
        }
    });
}
