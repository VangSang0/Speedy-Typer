const RANDOM_QUOTE_API_URL = "";
const quoteDisplayElement = document.getElementById("text-to-type");

function getRandomQuote() {
    fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content)
}

async function renderNewQuote() {
    const quote = await getRandomQuote();
    quoteDisplayElement.innerText = quote;

}

renderNewQuote();