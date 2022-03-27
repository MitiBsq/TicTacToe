//Declaring the Global variables
const computerHistory = new Array();
let moveTurn;
//Array with the winning combinations
const toWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
let setOfMovesForPc=new Array();
document.getElementById('gameInterface').style.display = 'none';

/* 
localStorage.setItem('pvpModGames', "0");
localStorage.setItem('pvpModP1Wins', "0");
localStorage.setItem('pvpModP2Wins', "0");
localStorage.setItem('pvpModDraws', "0");
localStorage.setItem('spModGames', "0");
localStorage.setItem('spModP1Wins', "0");
localStorage.setItem('spModP2Wins', "0");
localStorage.setItem('spModDraws', "0"); */

function ScoreTableHistory(theText, theGameMode, order, alignment) {
    document.getElementById('scoreTableText').innerText=theText;
    document.getElementById('games').innerText='Games: ' + localStorage.getItem(theGameMode+'ModGames');
    document.getElementById('winsP1').innerText='Player 1 Wins: ' +localStorage.getItem(theGameMode+'ModP1Wins');
    document.getElementById('winsP2').innerText='Player 2 Wins: ' +localStorage.getItem(theGameMode+'ModP2Wins');
    document.getElementById('draws').innerText='Draws: ' +localStorage.getItem(theGameMode+'ModDraws');
    document.getElementById('scoreTable').style.order=order;
    document.getElementById('scoreTable').style.alignItems=alignment;
}

//Function for choosing the multiPlayer game mode
document.getElementById('pvpMode').addEventListener('click', multiPlayer);
function multiPlayer() {
    ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '5', 'start');
    document.getElementById('infoGameMode').innerText = "MultiPlayer Mode";
    document.getElementById('chooseGameMode').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'flex';
    document.getElementById('easyWay').style.display = 'none';
    editPlayerStatus('player1', 'initial', 'Player 1', 'transparent');
    editPlayerStatus('player2', 'initial', 'Player 2', 'transparent');
    randomYes();
}

//The main function for single player mode
document.getElementById('spMode').addEventListener('click', singlePlayer);
function singlePlayer() {
    setOfMovesForPc = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
    ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '0', 'center');
    document.getElementById('gameInterface').style.display = 'flex';
    document.getElementById('easyWay').style.display = 'flex';
    document.getElementById('chooseGameMode').style.display = 'none';
    document.getElementById('infoGameMode').innerText = "Single Player Mode";
    editPlayerStatus('player1', 'initial', 'You', 'transparent');
    editPlayerStatus('player2', 'initial', 'Computer', 'transparent');
    document.getElementById('iStart').addEventListener('click', randomNot);
    document.getElementById('randomStart').addEventListener('click', randomYes);
    document.getElementById('hardMode').addEventListener('click', hardMode);
}

//Event functions for selecting sides 
function randomNot() {
    let [p1PlayWith, p2PlayWith] = whoIsWhat();
    createGame(p1PlayWith, p2PlayWith);
}

function randomYes() {
    let [p1PlayWith, p2PlayWith] = whoIsWhat('random');
    createGame(p1PlayWith, p2PlayWith);
}

//Function for selecting the player who starts with "X" and the one with "0"
function whoIsWhat(random) {
    document.getElementById('easyWay').style.display = 'none';
    if (Math.floor(Math.random() * 2) === 0 || random !== 'random') {
        moveTurn = 'player1';
        colorTheTurn();
        return ['X', '0'];
    } else {
        moveTurn = 'player2';
        colorTheTurn();
        return ['0', 'X'];
    }
}

//Creaza functia de hardmode
function hardMode() {
}

//Function for creating the game(genereting the game-table buttons)
function createGame(p1PlayWith, p2PlayWith) {
    const theButtons = new Array();
    const buttonPlace = document.createElement('div');
    buttonPlace.id = 'buttonPlace';
    document.getElementById('theGame').appendChild(buttonPlace);
    for (let i = 0; i < 9; ++i) {
        theButtons[i] = document.createElement('button');
        theButtons[i].id = "theButton" + i;
        theButtons[i].className = 'editButtons';
        buttonPlace.appendChild(theButtons[i]);
        if (i === 2 || i === 5) {
            buttonPlace.appendChild(document.createElement('br'));
        }
        theButtons[i].addEventListener('click', () => {
            buttonClick(p1PlayWith, p2PlayWith, i);
            theButtons[i].disabled = true;
        });
    }
    //If in random mode and the computer has the first move
    if (setOfMovesForPc.length !== 0) {
        ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '5', 'start');
        if (moveTurn === 'player2') {
            generateTheStrategy();
            setTimeout(function () {computerMoves(); }, 1.0 * 1000);
        }
    }
}

function buttonClick(p1PlayWith, p2PlayWith, theButton) {
    if (moveTurn === 'player1') {
        document.getElementById('theButton' + theButton).innerText = p1PlayWith;
            moveTurn = 'player2';
            colorTheTurn();
            didYouWon(p1PlayWith);
            if (setOfMovesForPc.length !== 0) {
                didYouWon(p2PlayWith);
                analyseTheMove(theButton);
                generateTheStrategy();
                setTimeout(function () { computerMoves(); }, 1.0 * 1000);
            }
    } else {
        document.getElementById('theButton' + theButton).innerText = p2PlayWith;
        moveTurn = 'player1';
        colorTheTurn();
        didYouWon(p2PlayWith);
    }
}

//Sa fac sa curat functia de sus
/* function applyTheTurn(theSymbol, theHistory) {
    document.getElementById('theButton' + theButton).innerText = theSymbol;
    p1MoveHistory.push(theButton);
} */


function disableOrNot(theValue) {
    for (let i = 0; i < 9; ++i) {
        document.getElementById('theButton' + i).disabled = theValue;
    }
}

//Function for analysing the movement of the player1(vs Computer only)
function analyseTheMove(theButton) {
    for (let i = 0; i < setOfMovesForPc.length; ++i) {
        setOfMovesForPc[i].forEach((theNumber) => {
            if (theNumber === theButton) {
                setOfMovesForPc.splice(i, 1);
                i--;
            }
        });
    }
}


//Function for generating the strategy for computer(vs Computer only)
let selectTheStrategy = new Array();
function generateTheStrategy() {
    //If computer starts or he follows with the second move of the game
    if (setOfMovesForPc.length === 8 || selectTheStrategy.length === 0) {
        selectTheStrategy = setOfMovesForPc[Math.floor(Math.random() * setOfMovesForPc.length)];
        return;
    } else if (setOfMovesForPc.length === 0) {
        //If computer doesnt have any other strategy left
        selectTheStrategy.length = 0
        for (let i = 0; i < 9; ++i) {
            if (document.getElementById('theButton' + i).innerText === '') {
                selectTheStrategy.push(i);
            }
        }
        return;
    } else {
        if (setOfMovesForPc.includes(selectTheStrategy) === false) {
            selectTheStrategy.length = 0;
            //If the strategy is no longer available
            setOfMovesForPc.forEach((strategy) => {
                strategy.forEach((elementOfStr) => {
                    computerHistory.forEach((historyElem) => {
                        if (historyElem === elementOfStr) {
                            selectTheStrategy = strategy;
                            return;
                        }
                    });
                });
            });
            //Fixing a bug where his last move doesnt bring him anymore new chances 
            if (selectTheStrategy.length === 0) {
                selectTheStrategy = setOfMovesForPc[Math.floor(Math.random() * setOfMovesForPc.length)];
                return;
            }
        }
    }
}

//Function for generating the move of the computer(vs Computer only)
function computerMoves() {
    let selectedMove;
    do {
        selectedMove = selectTheStrategy[Math.floor(Math.random() * selectTheStrategy.length)];
    } while (computerHistory.indexOf(selectedMove) !== -1);
    console.log('strategy', selectTheStrategy);
    console.log('theMove', selectedMove);
    if (document.getElementById('theButton' + selectedMove).innerText === '') {
        computerHistory.push(selectedMove);
        document.getElementById('theButton' + selectedMove).click();
    }
}

//Function for checking if somebody won
function didYouWon(theSymbolOfPlayer) {
    const historyMoves = new Array();
    for (let i = 0; i < 9; i++) {
        if (document.getElementById('theButton' + i).innerText === theSymbolOfPlayer) {
            historyMoves.push(i);
        }
    };
    toWin.forEach((potentialWin) => {
        let winCount = 0;
        historyMoves.forEach((element) => {
            for (let i = 0; i < 3; ++i) {
                if (potentialWin[i] === element) {
                    ++winCount;
                    break;
                }
            }
        });
        if (winCount === 3) {
            theWinnerIs(potentialWin);
            return ;
        }
    });
    //The didYouWon function is pressed after every move so this is for checking if the last move brings a draw not a win
    if (historyMoves.length > 4) {
        checkIfDraw();
    }
}

//Function for showing the winner
function theWinnerIs(theWinningButtons) {
    disableOrNot('true');
    for (let i = 0; i < 3; i++) {
        document.getElementById('theButton' + theWinningButtons[i]).style.backgroundColor = 'green';
    };
    editPlayerStatus('player1', 'none');
    editPlayerStatus('player2', 'none');
    if(computerHistory.length>0) {
        if (moveTurn==='player2') {
            messageTheResult('Congratulation, You won', 'green');
            increaseTheHistory('sp', 'P1Wins');
        } else {
            messageTheResult('The Computer got you, You lost', 'red');
            increaseTheHistory('sp', 'P2Wins');
        }
        ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '0', 'center');
    } else {
        if (moveTurn==='player2') {
            messageTheResult('Congratulation Player 1, You won', 'green');
            increaseTheHistory('pvp', 'P1Wins');

        } else {
            messageTheResult('Congratulation Player 2, You won', 'green');
            increaseTheHistory('pvp', 'P2Wins');
        }
        ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '5', 'start');
    }
    setTimeout(function () { theAfterButtons(); }, 1.0 * 2000);
}

function ScoreTableHistory(theText, theGameMode, order, alignment) {
    document.getElementById('scoreTableText').innerText=theText;
    document.getElementById('games').innerText='Games: ' + localStorage.getItem(theGameMode+'ModGames');
    document.getElementById('winsP1').innerText='Player 1 Wins: ' +localStorage.getItem(theGameMode+'ModP1Wins');
    document.getElementById('winsP2').innerText='Player 2 Wins: ' +localStorage.getItem(theGameMode+'ModP2Wins');
    document.getElementById('draws').innerText='Draws: ' +localStorage.getItem(theGameMode+'ModDraws');
    document.getElementById('scoreTable').style.order=order;
    document.getElementById('scoreTable').style.alignItems=alignment;
}

function increaseTheHistory(theGameMode, whoWon) {
    if(whoWon==='') {
        whoWon=theGameMode+'ModDraws';
        theIncreaseFunction(whoWon);
    } else {
        whoWon = theGameMode+'Mod'+ whoWon;
        theGameMode += 'ModGames';
        theIncreaseFunction(theGameMode);
        theIncreaseFunction(whoWon);
    }
}

function theIncreaseFunction(theKey) {
    let count=localStorage.getItem(theKey);
    ++count;
    localStorage.setItem(theKey, count);
}

//Function for checking if the game results in a draw
function checkIfDraw() {
    let count = 0;
    for (let i = 0; i < 9; i++) {
        if (document.getElementById('theButton' + i).disabled===true) {
            ++count;
        }
    }
    if (count > 6 && count !== 9) {
        thisLooksLikeADraw();
    }
}

//Function for showing the draw
function thisLooksLikeADraw() {
    disableOrNot('true');
    for (let i = 0; i < 9; i++) {
        document.getElementById('theButton' + i).style.backgroundColor = 'gray';
    };
    editPlayerStatus('player1', 'none');
    editPlayerStatus('player2', 'none');
    messageTheResult('This looks like a Draw...', 'black');
    if(computerHistory.length>0) {
        increaseTheHistory('sp', '');
        ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '0', 'center');
    } else {
        increaseTheHistory('pvp', '');
        ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '0', 'center');
    }
    setTimeout(function () { theAfterButtons();}, 1.0 * 2000);
}

//Function for creating the restart button
function theAfterButtons() {
    document.getElementById('buttonPlace').remove();
    const afterButtons = document.createElement('div');
    afterButtons.id = 'afterButtons';
    document.getElementById('theGame').appendChild(afterButtons);
    const restartButton = document.createElement('button');
    restartButton.className = 'btn btn-dark btn-lg';
    restartButton.id = 'restartButton';
    restartButton.innerText = 'Restart Game';
    afterButtons.appendChild(restartButton);
    restartButton.addEventListener('click', restartGame);
    const backButton = document.createElement('button');
    backButton.className = 'btn btn-dark btn-lg';
    backButton.id = 'backButton';
    backButton.innerText = 'Back to main Menu';
    afterButtons.appendChild(backButton);
    backButton.addEventListener('click', backToMainMenu);
}


function backToMainMenu() {
    document.getElementById('gameInterface').style.display = 'none';
    document.getElementById('chooseGameMode').style.display = 'flex';
    computerHistory.splice(0, computerHistory.length);
    removeFeatures();
}

//Sa termin functia(Sa readaug functiile + sa inceapa celalalt)
function restartGame() {
    removeFeatures();
    if (computerHistory.length>0) {
        computerHistory.splice(0, computerHistory.length);
        singlePlayer();
    } else {
        multiPlayer();
    }
}

function removeFeatures() {
    document.getElementById('afterButtons').remove();
    document.getElementById('theMessage').remove();
    setOfMovesForPc.splice(0, setOfMovesForPc.length);
    selectTheStrategy.splice(0, selectTheStrategy.length);
}

function colorTheTurn() {
    if(moveTurn==='player1'){
        if (setOfMovesForPc.length ===0 ) {
            editPlayerStatus('player1', 'initial', "Player 1 has the move: \n X", 'green');
            editPlayerStatus('player2', 'initial', "Player 2 waits: \n 0", 'red');
        } else {
            editPlayerStatus('player1', 'initial', "You have the move: \n X", 'green');
            editPlayerStatus('player2', 'initial', "The Computer waits: \n 0", 'red');
        }
    } else {
        if (setOfMovesForPc.length ===0) {
            editPlayerStatus('player1', 'initial', "Player 1 waits: \n 0", 'red');
            editPlayerStatus('player2', 'initial', "Player 2 has the move: \n X", 'green');
        } else {
            editPlayerStatus('player1', 'initial', "Wait for your turn: \n 0", 'red');
            editPlayerStatus('player2', 'initial', "The Computer has the move: \n X", 'green');
        }
    }
}

//Functions for editing the Player1/Player2 info-texts
function editPlayerStatus(theId, ifDisplay, theText, theColor) {
    document.getElementById(theId).style.display = ifDisplay;
    document.getElementById(theId).innerText = theText;
    document.getElementById(theId).style.backgroundColor = theColor;
}

//Function for editing the message with Win/Draw context
function messageTheResult(theText, theColor) {
    const theMessage = document.createElement('h4');
    theMessage.innerText = theText;
    theMessage.style.color=theColor;
    theMessage.id = 'theMessage';
    document.getElementById('playerTurn').appendChild(theMessage);
}


//Bonus sa fac mode hard pentru cand joci contra pc sa nu il poti bate(cand tu incepi)
//{Sa il fac sa iti ia miscarile castigatoare si sa puna acolo(sa inceapa din mijloc?)}!!
//Am creat butonul,, adauga event si fa functia


//Sa curat functiile + sa curat css