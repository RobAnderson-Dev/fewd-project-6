/* GLOBAL VARIABLES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
const keyboard = document.getElementById('qwerty');
const phrase = document.getElementById('phrase');
const btnReset = document.querySelector('.btn__reset');
const btnQuit = document.getElementById('quit');
const overlay = document.getElementById('overlay');
const heading = document.querySelector('#overlay h2');
const ul = document.querySelector('#phrase ul');

const timeLimit = 30;
const winMessage = 'advance';
const loseMessage = 'de-rezzed';

let missed = 0;
const phrases = [
    'Stupid is as stupid does',
    'Bubba Gump',
    'I have to pee',
    'Run Forest run',
    'Seats taken'
];

/* FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* input string array; return random string as character array */
function getRandomPhraseAsArray(array) {
    const randomNum = Math.floor(Math.random() * phrases.length);
    return array[randomNum].split('');
}

/* input character array, create <li> for each character, 
assign class attribute, append to <ul> */
function addPhraseToDisplay(array) {

    array.forEach( (character) => {
        const listItem = document.createElement('li');
        listItem.textContent = character;
        if (character === ' ') {
            listItem.className = 'space';
        } else {
            listItem.className = 'letter';
        }
        phrase.firstElementChild.appendChild(listItem);
    });
    return phrase;
}

/* input user button, check for text match against each phrase <li>,
return matching character or null  */
function checkLetter(button) {
    const phraseListItems = document.querySelectorAll('#phrase li');
    let match = null;

    for (let i=0; i<phraseListItems.length; i++) {
        if (button.textContent === phraseListItems[i].textContent.toLowerCase()) {
            phraseListItems[i].classList.add('show');
            match = button.textContent;
        }
    }
    return match;
}

/* input incorrect guesses, determine if win or lose condition is met */
function isWin(missed, phraseLetterCount, displayLetterCount) {

    if (phraseLetterCount === displayLetterCount) {
        setTimeout(() => {
            resetGame();
            endGame('win', winMessage);
        }, 1*1000);
        // clearInterval(interval);
        // clearTimeout();
    } else if (missed > 4) {
        setTimeout(() => {
            resetGame();
            endGame('lose', loseMessage);
        }, 1*1000);
        // clearInterval(interval);
        // clearTimeout();
    }
}

/* input win/lose class selector and heading text, update overlay */
function endGame(className, textContent) {
    overlay.className = className;
    heading.textContent = textContent;
    overlay.style.display = 'flex';
}

/* input phrase character count, remove phrase display, reset
keyboard, reset live hearts */
function resetGame() {
    missed = 0;
    /* input phrase character count, remove phrase display */
    let phraseItemCount = document.querySelectorAll('#phrase li').length;
    for (let i=0; i<phraseItemCount; i++) {
        ul.firstChild.remove();
    }
    /* reset "keyboard" */
    keyboard.style.display = 'none';
    const buttons = document.getElementsByTagName('button');
    for (let button of buttons) {
        button.classList.remove('chosen');
    }
    /* reset live hearts */
    const hearts = document.querySelector('#scoreboard ol');
    let html = '';
    for (let i=0; i<5; i++) {
        html += `<li class="tries">
        <img src="images/liveHeart.png" height="35px" width="30px">
        </li>`;
    }
    hearts.innerHTML = html;
}

// /* countdown and timeout timers */
// function timers() {
//     const timer = document.getElementById('timer');
//     timer.textContent = timeLimit;
    
//     const start = Date.now();
//     const interval = setInterval(() => {
//         const millis = Date.now() - start;
//         const elapsed = Math.floor(millis / 1000);
//         const countdown = timeLimit - elapsed;
//         timer.textContent = countdown;
//         console.log(countdown);
//     }, 1000);
//     setTimeout(() => {
//         clearInterval(interval);
//         resetGame();
//         endGame('lose', loseMessage);
//     }, timeLimit*1000);
//     return interval;
// }

/* CODE BODY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

/* listen for "Start" click, hide overlay to begin game */
btnReset.addEventListener('click', () => {
    keyboard.style.display = 'block';
    const randomPhraseArray = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(randomPhraseArray);
    document.getElementById('overlay').style.display = 'none';
});

/* listen for "keyboard" click, call comparison function, display matching
character or increment misses, check win/lose status */
keyboard.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.className !== 'chosen') {
        e.target.className = 'chosen';
        const checkResult = checkLetter(e.target);
        if (checkResult === null) {
            document.querySelector('#scoreboard ol').lastElementChild.remove();
            missed += 1;
        }
    }
    const phraseLetterCount = document.querySelectorAll('#phrase li.letter').length;
    const displayLetterCount = document.querySelectorAll('#phrase li.show').length;
    isWin(missed, phraseLetterCount, displayLetterCount);
});

btnQuit.addEventListener('click', () => window.location.reload());
