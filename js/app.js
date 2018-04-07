/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// ## performance monitoring
// const startingTime = performance.now();
// performance monitoring


// Initialize Variables

const deck = document.getElementsByClassName('deck')[0];
let resetBtn = document.getElementsByClassName('restart')[0];
let ratingStars = document.querySelectorAll('.fa.fa-star');
let cards = shuffle([...document.querySelectorAll('.card')]);
let counter = document.getElementsByClassName('moves')[0];
let progressBar = document.getElementById('progressbar');
let docFrag = document.createDocumentFragment();
let openCards = [];
let guessedCards = 0;
let movesCounter = 0;

// Game timer variables and elements
// change this to change game difficulty
let timeLimit = 90; // play time limit in seconds, if the user reach 60 seconds then game over...
                    // TODO: add 3 user selectable levels, easy (2 min.), normal (1.5 min.) , hard (30 sec)


let startTime;      // used to save the start time timestamp
let playTime;       // used to save the play time
let timerId;
let timer = document.createElement('div');
timer.className = 'timer';
timer.innerText = '00:00';
resetBtn.insertAdjacentElement('beforeBegin', timer); // add the timer to the DOM

// Completed  game event
let gameCompletedEvt = new CustomEvent('gameCompleted');

for (el of cards) {
    el.className = 'card';
    docFrag.appendChild(el);
}

counter.innerHTML = '0';
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


 
/**
 * @description Start the timer at the first card flip, add classes to flip the card
 * @param {event} evt The click event
 * 
 */ 
const displaySymbol = function (evt) {
    let cardSymbol = '';

    // start the timer
    if (startTime === undefined && evt.target.nodeName === 'LI') {
        startTime = Date.now();
        timerId = setInterval(runTimer, 1000);
        timer.classList.add('running');
    }

    // open the card
    if (evt.target.nodeName === 'LI' && evt.target.className === 'card' && openCards.length <= 1) {
        evt.target.classList.add('open', 'show');
        cardSymbol = evt.target.firstElementChild.className;
        addToOpenCards(cardSymbol);
    } else if (evt.target.parentNode.nodeName === 'LI' && evt.target.parentNode.className === 'card' && openCards.length <= 1) {
        evt.target.parentNode.classList.add('open', 'show');
        cardSymbol = evt.target.className;
        addToOpenCards(cardSymbol);
    }
}



/**
 * @description Check if flipped cards match, if cards match invoke functions to lock cards, 
 *increment move counter, and check if there are other cards to guess
 *if does not match shake cards increment move counter and flip back cards
 * @param {string} cardSymbol The card icon class
 * 
 */  
const addToOpenCards = function (cardSymbol) {
    if (openCards.length === 0) {
        openCards.push(cardSymbol);
    } else if (openCards.length === 1) {
        openCards.push(cardSymbol);
        // if open cards match
        if (openCards[0] === openCards[1]) { 
            lockCards();
            incrementCounter();
            checkForComplete();
        // if open cards does not match
        } else { 
            shakeCards();
            incrementCounter();
            window.setTimeout(() => {
                flipCards();
            }, 1000);
        }

    }

}

/**
 * @description Lock guessed cards, increment guessed cards variable, and empty open cards array
 * 
 * 
 */  
const lockCards = function () {
    let cards = document.querySelectorAll('.card.open.show');
    for (card of cards) {
        card.className = 'card';
        card.classList.add('match');
    }
    guessedCards += 1;
    openCards = [];
}


/**
 * @description Flip back non matching cards and empty open cards array
 * 
 * 
 */ 
const flipCards = function () {
    let cards = document.querySelectorAll('.card.open.show');
    for (card of cards) {
        card.className = 'card';
    }
    openCards = [];
}


/**
 * @description Add shake class effect to opened not matching cards
 * 
 * 
 */ 
const shakeCards = function () {
    let cards = document.querySelectorAll('.card.open.show');
    for (card of cards) {
        card.classList.add('shake');
    }
}


/**
 * @description Increments the move counter and invoke function to update the star rating
 * 
 * 
 */ 
const incrementCounter = function () {
    movesCounter += 1;
    counter.innerHTML = movesCounter;
    updateRating(movesCounter);
}


/**
 * @description Update the star rating icons
 * @param {number} mc Move count 
 * 
 */ 
const updateRating = function (mc) {
    // reset the counter 
    if (mc === 0) {
        for (star of ratingStars) {
            star.className = 'fa fa-star';
        }
    // rate 2 stars after  12 move
    } else if (mc === 12) {
        ratingStars[2].className = 'fa fa-star-o';
    // rate 1 stars after  18 move
    } else if (mc === 18) {
        ratingStars[1].className = 'fa fa-star-o';
    }
}


/**
 * @description Check if all cards are guessed, 
 * if all cards are guessed dispatch the completed game custom event
 * 
 * 
 */ 
const checkForComplete = function () {
    guessedCards === 8 ? deck.dispatchEvent(gameCompletedEvt) : false;
}


/**
 * @description Reset all variables and elements and shuffle cards 
 * 
 * 
 */ 
const resetGame = function () {
    openCards = [];
    guessedCards = 0;
    movesCounter = 0;
    counter.innerHTML = '0';
    deck.innerHTML = '';
    timer.innerText = '00:00';
    startTime = undefined;
    clearInterval(timerId);
    timer.classList.remove('running');
    progressBar.setAttribute('value', '0');
    updateRating(0);
    cards = shuffle(cards);
    for (el of cards) {
        el.className = 'card';
        docFrag.appendChild(el);
    }
    deck.appendChild(docFrag);
}


/**
 * @description Open the final overlay, stop the timer, display final info
 * @param {result} string 
 * 
 */ 
const showResume = function (result) {

    clearInterval(timerId);
     
    if (result === 'lose') {
        docFrag.innerHTML = `
        <section class="finalscreen">
        <h1 class="finaltitle"><i class="fa fa-hourglass-end"></i><br>GAME OVER</h1>
        <p class="finalmessage">Sorry... you exceeded the time limit</p>
        <button id="finalreload"><i class="fa fa-repeat"></i> TRY AGAIN</button>
        </section> `;
    } else {
        docFrag.innerHTML = `
        <section class="finalscreen">
        <h1 class="finaltitle"><i class="fa fa-check"></i><br>GAME COMPLETED</h1>
        <ul class="finalrating"><li>${ratingStars[0].outerHTML}</li><li>${ratingStars[1].outerHTML}</li><li>${ratingStars[2].outerHTML}</li></ul>
        <p class="finalmessage">You win in ${movesCounter} moves!!! <br/> Game duration: ${playTime}</p>
        <button id="finalreload"><i class="fa fa-repeat"></i> PLAY AGAIN</button>
        </section> `;
    }

    deck.insertAdjacentHTML('afterend', docFrag.innerHTML);
    reloadBtn = document.getElementById('finalreload');
    reloadBtn.addEventListener('click', function reloadFnc() {
        reloadBtn.parentNode.remove();
        resetGame();
    })
}


/**
 * @description Create and update the timer and the progress bar
 * 
 * 
 */ 
const runTimer = function () {
    // timer functions inspired by
    // https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
    // https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
    
    let seconds, minutes, timelapse, progress;
    timelapse = Date.now() - startTime;
    seconds = Math.floor(timelapse / 1000);
    minutes = Math.floor(seconds / 60);
    playTime = minutes.toString().padStart(2, 0) + ':' + (seconds % 60).toString().padStart(2, 0);
    progress = ((seconds * 100) / timeLimit).toFixed(2);
    
    // send timer DOM updates to the queue
    setTimeout(function () {
        timer.innerText = playTime;       
        progressBar.setAttribute('value', progress);
        if (seconds >= timeLimit) {
            showResume('lose');
        }
    }, 0)

}


/*
 * EVENT LISTENERS
 */ 
deck.addEventListener('click', displaySymbol);
deck.addEventListener('gameCompleted', showResume);
resetBtn.addEventListener('click', resetGame);



// ## performance monitoring
// const endingTime = performance.now();
//console.log('This code took ' + (endingTime - startingTime) + ' milliseconds.');
// performance monitoring