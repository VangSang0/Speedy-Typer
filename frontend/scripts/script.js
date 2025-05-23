const quoteDisplayElement = document.getElementById('text-to-type');
const quoteInputElement = document.getElementById('user-input');
const timer = document.getElementById('timer');
let correct = 0;
let incorrect = 0;
let timerInterval = null;
let timerStarted = false;
let gameActive = false;


quoteInputElement.addEventListener('input', () => {
    if (!timerStarted && quoteInputElement.value.length > 0) {
        startTimer(30);
        timerStarted = true;
        gameActive = true;
    }
    const arrayQuote = quoteDisplayElement.querySelectorAll('span');
    const arrayValue = quoteInputElement.value.split('');
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index]
        if (character == null){
            characterSpan.classList.remove('correct', 'incorrect')
        } else if(character === characterSpan.innerText){
            characterSpan.classList.add('correct')
            characterSpan.classList.remove('incorrect')
        } else{
            characterSpan.classList.remove('correct')
            characterSpan.classList.add('incorrect')
        }
    });
    if (arrayValue.length >= arrayQuote.length) {
        endGame();
    }
});

function getRandomQuote() {
    return fetch('http://localhost:3000/random-paragraph') 
        .then((response) => response.json())
        .then((data) => data.paragraph)  
}

async function renderNewQuote() {
    try {
        quoteDisplayElement.innerText = '' ;
        const quote = await getRandomQuote();
        quote.split('').forEach(character => {
            const characterSpan = document.createElement('span');
            characterSpan.innerText = character;
            quoteDisplayElement.appendChild(characterSpan);
        })
    } catch (error) {
        quoteDisplayElement.innerText = "Failed to load quote";
    }
}

function startTimer(seconds) {
    let counter = seconds;
    timer.innerText = counter;
    
    timerInterval = setInterval(() => {
        counter--;
        timer.innerText = counter;
        
        if (counter <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame(){
    if (timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

renderNewQuote();