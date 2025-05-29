const quoteDisplayElement = document.getElementById('text-to-type');
const quoteInputElement = document.getElementById('user-input');
const timer = document.getElementById('timer');
const wpm = document.getElementById('wpm-value');

let timerInterval = null;
let timerStarted = false;
let gameActive = false;
let wpmInterval = null;
let startTime = null;


quoteInputElement.addEventListener('input', () => {
    if (!timerStarted && quoteInputElement.value.length > 0) {
        startTimer();
        startWPMCounter();
        timerStarted = true;
        gameActive = true;
        startTime = Date.now();
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
    if (arrayValue.length + 1 >= arrayQuote.length) {
        endGame();
    }
});


// Api Calling Gemini
async function getRandomQuote() {
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

function startTimer() {
    let counter = 0;
    timer.innerText = counter;
    
    timerInterval = setInterval(() => {
        counter++;
        timer.innerText = counter;
    }, 1000);
}

function calculateWPM() {
    if (!startTime || !gameActive) return 0;
    
    const currentTime = Date.now();
    const timeElapsed = (currentTime - startTime) / 1000 / 60; 
    
    const originalWords = quoteDisplayElement.innerText.trim().split(/\s+/);
    const typedWords = quoteInputElement.value.trim().split(/\s+/);
    
    let correctWords = 0;
    for (let i = 0; i < typedWords.length && i < originalWords.length; i++) {
        if (typedWords[i] === originalWords[i]) {
            correctWords++;
        }
    }

    const wpm = timeElapsed > 0 ? Math.round(correctWords / timeElapsed) : 0;
    return wpm;
}

function startWPMCounter() {
    wpmInterval = setInterval(() => {
        if (gameActive) {
            const currentWPM = calculateWPM();
            wpm.innerText = currentWPM;
        }
    }, 500);
}

function endGame(){
    if (timerInterval){
        clearInterval(timerInterval);
        timerInterval = null;
    }
    if (wpmInterval) {
        clearInterval(wpmInterval);
        wpmInterval = null;
    }
    gameActive = false;
    showResults();
    quoteInputElement.readOnly = true;
}


function calculateAccuracy() {
    const correctCount = document.querySelectorAll('.correct').length;
    const incorrectCount = document.querySelectorAll('.incorrect').length;
    const total = correctCount + incorrectCount;
    if (total === 0) return 0;
    return Math.round((correctCount / total) * 100);
}

async function showResults() {
    const correctCount = document.querySelectorAll('.correct').length;
    const incorrectCount = document.querySelectorAll('.incorrect').length;
    const accuracy = calculateAccuracy();
    
    alert(`Game Over! \nWPM: ${wpm.innerText} \nCorrect: ${correctCount} \nIncorrect: ${incorrectCount} \nAccuracy: ${accuracy}%`);

    resetGame();
    await renderNewQuote();
    quoteInputElement.readOnly = false; 
}


function resetGame() {
    clearInterval(timerInterval);
    timer.innerText = '0';
    wpm.innerText = '0';
    quoteInputElement.value = '';
    timerStarted = false;
    gameActive = false;
}



renderNewQuote();