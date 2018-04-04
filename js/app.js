/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// performance monitoring
const startingTime = performance.now();
// performance monitoring


// Initialize Variables

const deck = document.getElementsByClassName('deck')[0];
let resetBtn = document.getElementsByClassName('restart')[0];
let cards = shuffle([...document.querySelectorAll('.card')]);
let counter =  document.getElementsByClassName('moves')[0];
let docFrag = document.createDocumentFragment();
let openCards = [];
let guessedCards = 0;
let movesCounter = 0;
let gameCompletedEvt = new CustomEvent('gameCompleted');

for (el of cards) {
    el.className = 'card';
    docFrag.appendChild(el);
}

counter.innerHTML='0';
deck.innerHTML = '';
deck.appendChild(docFrag);




// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/



const displaySymbol = function (evt) {    
    let cardSymbol = '';

    if (evt.target.nodeName === 'LI' && evt.target.className === 'card' &&  openCards.length<=1) {
        evt.target.classList.add('open', 'show');        
        cardSymbol = evt.target.firstElementChild.className;
        addToOpenCards(cardSymbol);
    } else if (evt.target.parentNode.nodeName === 'LI'&& evt.target.parentNode.className === 'card' && openCards.length<=1) {
        evt.target.parentNode.classList.add('open', 'show');
        cardSymbol = evt.target.className;
        addToOpenCards(cardSymbol);
        }
    
}

const addToOpenCards = function (cardSymbol) {
    if (openCards.length === 0) {
        openCards.push(cardSymbol);
    } else if (openCards.length === 1) {
        openCards.push(cardSymbol);
        if (openCards[0] === openCards[1]) {
            lockCards();
            incrementCounter();
            checkForComplete();
        } else {
            shakeCards();
            incrementCounter();
            window.setTimeout(() => {
                flipCards();
            }, 1000);
        }

    }

}

const lockCards = function () {
    let cards = document.querySelectorAll('.card.open.show');
    for (card of cards) {
        card.className = 'card';
        card.classList.add('match')
    }
    guessedCards += 1;
    openCards = [];

    
}

const flipCards = function () {
    let cards = document.querySelectorAll('.card.open.show');
    for (card of cards) {
        card.className = 'card';        
    }
    openCards = [];    
}


const shakeCards = function(){
    let cards = document.querySelectorAll('.card.open.show');
    for (card of cards) {
        card.classList.add('shake')
    }
}


const incrementCounter = function () {
    movesCounter += 1;
    counter.innerHTML = movesCounter;
}


const checkForComplete = function () {
    guessedCards === 8 ? deck.dispatchEvent(gameCompletedEvt) : false;
}


const resetGame = function(){   
    openCards = [];
    guessedCards = 0;
    movesCounter = 0;
    counter.innerHTML='0';
    deck.innerHTML = '';
    cards = shuffle(cards);
    for (el of cards) {
        el.className = 'card';
        docFrag.appendChild(el);
    }
    deck.appendChild(docFrag);
}

const showResume = function(){   

    docFrag.innerHTML = `
    <section class="finalscreen">    
    <h1 class="finaltitle"><i class="fa fa-check"></i><br>GAME COMPLETED</h1>
    <p class="finalmessage">You win in ${movesCounter} moves !!!</p>
    <button id="finalreload"><i class="fa fa-repeat"></i> PLAY AGAIN</button>
    </section> `;

    deck.insertAdjacentHTML('afterend', docFrag.innerHTML);
    reloadBtn = document.getElementById('finalreload');
    reloadBtn.addEventListener('click', function reloadFnc(){        
        reloadBtn.parentNode.remove();
        resetGame();        
    })
}


/*
Event listeners
*/
deck.addEventListener('click', displaySymbol);
deck.addEventListener('gameCompleted', showResume);
resetBtn.addEventListener('click', resetGame);





// performance monitoring
const endingTime = performance.now();
console.log('This code took ' + (endingTime - startingTime) + ' milliseconds.');
// performance monitoring