

let game = {
    elCurrentScore: null,
    elHighscore: null,
    elWinScore: null,
    elBtnClear: null,
    elBtnPlayAgain: null,
    elDeck: null,
    elWinPanel: null,
    cardTypes: 10,
    arrCards: [],
    storageName: 'memory-highscore',
    canPlay: true,
    firstCard: null,
    currentScore: 0,
    timer: null,
    showTime: 1000,
    foundPairs: 0,
    highscore: 0,
};

function shuffleArray(arr) {
    let currentIndex = arr.length - 1;

    while(currentIndex >= 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
    

        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];

        currentIndex --;
    }
}

function getCardHTML(numeroCarte) {
    /*
        <div class="card">
            <div class="image" style="background-image:url('./cartes/carte_[numeroCarte].jpg')"></div>
            <div class="back"></div>
        </div>
    */
    let elCard = document.createElement('div');
    elCard.classList.add('card');
    elCard.dataset.id = numeroCarte;
    
    //let innerCard = '<div class="image" style="background-image:url(\'./cartes/carte_'+ numeroCarte +'.jpg\')"></div>'
    let innerCard = `<div class="image" style="background-image:url('./cartes/carte_${numeroCarte}.jpg')"></div>`;
    innerCard += '<div class="back"></div>';

    elCard.innerHTML = innerCard;

    elCard.addEventListener('click', handlerCardClick);

    return elCard;
}

function handlerCardClick(evt){

    let elCard = evt.target.offsetParent;
    
    if (!game.canPlay) {
        return;
    }
    
    clearTimeout(game.timer);

    let cardIsNotPlayable = elCard.classList.contains('flipped');
    
    if (cardIsNotPlayable) {
        return;
    }
    
    elCard.classList.add('flipped');

    let cardIsFirst = game.firstCard === null;

    if (cardIsFirst) {
        game.firstCard = elCard;
        return;
    }

    game.currentScore ++;

    game.elCurrentScore.textContent = game.currentScore;

    let cardIsDifferent = elCard.dataset.id !== game.firstCard.dataset.id;

    if (cardIsDifferent) {
        game.canPlay = false;

        game.timer = setTimeout(function() {
            elCard.classList.remove('flipped');

            game.firstCard.classList.remove('flipped');

            game.firstCard = null;

            game.canPlay = true;

        }, game.showTime);
        
        return;
    }

    game.firstCard = null;

    game.foundPairs ++;

    let allFound = game.foundPairs >= game.cardTypes;

    if(!allFound) {
        return;
    }

    wonGame();
}


function initGame() {
    // TODO: code
    game.elCurrentScore = document.getElementById('the-score-display');
    game.elHighscore = document.getElementById('the-highscore-display');
    game.elWinScore = document.getElementById('the-win-score-display');

    game.elBtnClear = document.getElementById('the-clear-highscore-button');
    game.elBtnPlayAgain = document.getElementById('the-play-again-button');

    game.elDeck = document.getElementById('the-deck');
    game.elWinPanel = document.getElementById('the-win-panel');

    game.elBtnClear.addEventListener('click', function(){
        console.log('Effacement du record...')
        localStorage.removeItem(game.storageName);

        game.highscore = 0;
        game.elHighscore.textContent = game.highscore;
    });
    game.elBtnPlayAgain.addEventListener('click', function(){
        newGame();
    });

    let storedHighscore = localStorage.getItem(game.storageName);

    if(storedHighscore === null) {
        storedHighscore = 0;
    }

    game.highscore = storedHighscore;
    game.elHighscore.textContent = game.highscore;

    newGame();
}

function newGame() {
    console.log('Partie démarrée...')
    
    game.elDeck.innerHTML = '';
    game.arrCards = [];

    game.foundPairs = 0;

    for(let numeroCarte = 1; numeroCarte <= game.cardTypes; numeroCarte ++) {
        game.arrCards.push(numeroCarte, numeroCarte);
    }

    shuffleArray(game.arrCards);

    for(let numeroCarte of game.arrCards) {
        let elCard = getCardHTML(numeroCarte);
        game.elDeck.append(elCard);
    }

    game.currentScore = 0;
    game.elCurrentScore.textContent = game.currentScore;

    game.elWinPanel.classList.add('hidden');
    game.elDeck.classList.remove('hidden');
}

function wonGame() {
    game.elWinScore.textContent = game.currentScore;

    if(game.currentScore < game.highscore || game.highscore <= 0) {
        game.highscore = game.currentScore;
        game.elHighscore.textContent = game.highscore;

        localStorage.setItem(game.storageName, game.highscore);
    }

    game.elDeck.classList.add('hidden');

    game.elWinPanel.classList.remove('hidden');
}

initGame();