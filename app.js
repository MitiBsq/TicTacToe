//Declaring the Global variables
const computerHistory = new Array();
let moveTurn;
//Array with the winning combinations
let toWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
let setOfMovesForPc = new Array();
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
    document.getElementById('scoreTableText').innerText = theText;
    document.getElementById('games').innerText = 'Games: ' + localStorage.getItem(theGameMode + 'ModGames');
    document.getElementById('winsP1').innerText = 'Player 1 Wins: ' + localStorage.getItem(theGameMode + 'ModP1Wins');
    document.getElementById('winsP2').innerText = 'Player 2 Wins: ' + localStorage.getItem(theGameMode + 'ModP2Wins');
    document.getElementById('draws').innerText = 'Draws: ' + localStorage.getItem(theGameMode + 'ModDraws');
    document.getElementById('scoreTable').style.order = order;
    document.getElementById('scoreTable').style.alignItems = alignment;
}

//Function for choosing the multiPlayer game mode
document.getElementById('pvpMode').addEventListener('click', multiPlayer);
function multiPlayer() {
    ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '5', 'start');
    document.getElementById('infoGameMode').innerText = "MultiPlayer Mode";
    document.getElementById('chooseGameMode').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'flex';
    document.getElementById('easyWay').style.display = 'none';
    editPlayerStatus('player1', 'flex', 'Player 1', 'transparent');
    editPlayerStatus('player2', 'flex', 'Player 2', 'transparent');
    whoIsWhat("pvpMode(p1PlayWith, p2PlayWith, i)", 'random');
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
    editPlayerStatus('player1', 'flex', 'You', 'transparent');
    editPlayerStatus('player2', 'flex', 'Computer', 'transparent');
    document.getElementById('iStart').addEventListener('click', randomNot);
    document.getElementById('randomStart').addEventListener('click', randomYes);
    document.getElementById('hardMode').addEventListener('click', callingHard);
}

function randomYes() {
    whoIsWhat("spModeEasy(p1PlayWith, p2PlayWith, i)", 'random');
}

function randomNot() {
    whoIsWhat("spModeEasy(p1PlayWith, p2PlayWith, i)");
}

//Creaza functia de hardmode
function callingHard() {
    document.getElementById('scoreTable').style.display='none';
    document.getElementById('infoGameMode').innerText = "Single Player Mode\n HardMode";
    whoIsWhat("hardMode(p1PlayWith, p2PlayWith, i)");
}

//Function for selecting the player who starts with "X" and the one with "0"
function whoIsWhat(theCalledEvent, random) {
    let p1PlayWith, p2PlayWith;
    document.getElementById('easyWay').style.display = 'none';
    if (Math.floor(Math.random() * 2) === 0 || random !== 'random') {
        moveTurn = 'player1';
        colorTheTurn();
        [p1PlayWith, p2PlayWith] = ['X', '0'];
    } else {
        moveTurn = 'player2';
        colorTheTurn();
        [p1PlayWith, p2PlayWith] = ['0', 'X'];
    }
    if (theCalledEvent[0] === 's' && moveTurn === 'player2') {
        generateTheStrategy();
        setTimeout(function () { computerMoves(); }, 1.0 * 1000);
    }
    createButtons(theCalledEvent, p1PlayWith, p2PlayWith);
}

//Function for creating the game(genereting the game-table buttons)
function createButtons(nameOfTheEvent, p1PlayWith, p2PlayWith) {
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
            eval(nameOfTheEvent);
            theButtons[i].disabled = true;
        });
    }
}

//Function for game-movement in PVPmode
function pvpMode(p1PlayWith, p2PlayWith, theButton) {
    if (moveTurn === 'player1') {
        theClick(theButton, p1PlayWith, 'player2');
    } else {
        theClick(theButton, p2PlayWith, 'player1');
    }
}

//Function for game-movement in SPmode
function spModeEasy(p1PlayWith, p2PlayWith, theButton) {
    if (moveTurn === 'player1') {
        let check=theClick(theButton, p1PlayWith, 'player2');
        if(moveTurn === 'player2') {
            analyseTheMove(theButton);
            generateTheStrategy();
            setTimeout(function () { computerMoves(); }, 1.0 * 1000);
        }
    } else {
        theClick(theButton, p2PlayWith, 'player1');
    }
}

function hardMode(p1PlayWith, p2PlayWith, theButton) {
    if (moveTurn === 'player1') {
        theClick(theButton, p1PlayWith, 'player2');
        setTimeout(function () { pcHardMoves(); }, 1.0 * 1000);
    } else {
        theClick(theButton, p2PlayWith, 'player1');
    }
}

//Function for generating the moves of the computer in HardMode
function pcHardMoves() {
    if (computerHistory.length === 0) {
        if (document.getElementById('theButton' + 4).innerText === '') {
            computerHistory.push(4);
            document.getElementById('theButton' + 4).click();
        } else {
            let random = [0, 2, 6, 8][Math.floor(Math.random() * 4)];
            document.getElementById('theButton' + random).click();
            computerHistory.push(random);
        }
    } else {
        let newMove=new Object();
        for (let i = 0 ; i < toWin.length ; ++i) {
            let check = 0;
            let checkWin=0;
            let missingMove = 0;
            for(let j = 0 ; j < 3 ; ++j) {
                if (document.getElementById('theButton' + toWin[i][j]).innerText === 'X') {
                    ++check;
                } else  if (document.getElementById('theButton' + toWin[i][j]).innerText === '0') {
                    ++checkWin;
                }
            }
            if(checkWin>1) {
                for(let j = 0 ; j < 3 ; ++j) {
                    if (document.getElementById('theButton' + toWin[i][j]).innerText === '') {
                        missingMove = toWin[i][j];
                    }
                }
                document.getElementById('theButton' + missingMove).click();
                    return
            } else if (check > 1) {
                for(let j = 0 ; j < 3 ; ++j) {
                    if (document.getElementById('theButton' + toWin[i][j]).innerText === '') {
                        missingMove = toWin[i][j];
                    }
                }
                    document.getElementById('theButton' + missingMove).click();
                    return
            } 
            if(check===0) {
                for (let j = 0 ; j < 3 ; ++j) {
                    if (document.getElementById('theButton' + toWin[i][j]).innerText === '0') {
                        ++check;
                    }
                }
                newMove[check]=toWin[i];
            }
        }
         if (moveTurn==='player2') {
            if(Object.keys(newMove).length===1) {
                for(let i = 0 ; i < 3 ; ++i) {
                    if (document.getElementById('theButton' + Object.values(newMove)[0][i]).innerText === '') {
                        document.getElementById('theButton' +  Object.values(newMove)[0][i]).click();
                        return
                    }
                }
            } else {
                for(let i = 0 ; i < 3 ; ++i) {
                    if (document.getElementById('theButton' + Object.values(newMove)[1][i]).innerText === '') {
                        document.getElementById('theButton' +  Object.values(newMove)[1][i]).click();
                        return
                    }
                }
            }
        } 
    }
}


//Function applying
function theClick(theButton, whoPressed, whoIsNext) {
    document.getElementById('theButton' + theButton).innerText = whoPressed;
    moveTurn = whoIsNext;
    colorTheTurn();
    didYouWon(whoPressed);
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
function generateTheStrategy(stop) {
    if (stop === 'stop') { } else {
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
}

//Function for generating the move of the computer(vs Computer only)
function computerMoves() {
    let selectedMove;
    do {
        selectedMove = selectTheStrategy[Math.floor(Math.random() * selectTheStrategy.length)];
    } while (computerHistory.indexOf(selectedMove) !== -1);
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
            return;
        }
    });
    //The didYouWon function is pressed after every move so this is for checking if the last move brings a draw not a win
        checkIfDraw();
}

//Function for showing the winner
function theWinnerIs(theWinningButtons) {
    disableOrNot('true');
    for (let i = 0; i < 3; i++) {
        document.getElementById('theButton' + theWinningButtons[i]).style.backgroundColor = 'green';
    };
    editPlayerStatus('player1', 'none');
    editPlayerStatus('player2', 'none');
    if (computerHistory.length > 0) {
        if (moveTurn === 'player2') {
            messageTheResult('Congratulation, You won', 'green');
            increaseTheHistory('sp', 'P1Wins');
        } else {
            messageTheResult('The Computer got you, You lost', 'red');
            increaseTheHistory('sp', 'P2Wins');
        }
        document.getElementById('theGame').style.marginTop = '3%';
        ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '0', 'center');
    } else {
        if (moveTurn === 'player2') {
            messageTheResult('Congratulation Player 1, You won', 'green');
            increaseTheHistory('pvp', 'P1Wins');

        } else {
            messageTheResult('Congratulation Player 2, You won', 'green');
            increaseTheHistory('pvp', 'P2Wins');
        }
        document.getElementById('theGame').style.marginTop = '3%';
        ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '0', 'center');
    }
    moveTurn='';
    setTimeout(function () { theAfterButtons(); }, 1.0 * 2000);
}

function ScoreTableHistory(theText, theGameMode, order, alignment) {
    document.getElementById('scoreTableText').innerText = theText;
    document.getElementById('games').innerText = 'Games: ' + localStorage.getItem(theGameMode + 'ModGames');
    document.getElementById('winsP1').innerText = 'Player 1 Wins: ' + localStorage.getItem(theGameMode + 'ModP1Wins');
    document.getElementById('winsP2').innerText = 'Player 2 Wins: ' + localStorage.getItem(theGameMode + 'ModP2Wins');
    document.getElementById('draws').innerText = 'Draws: ' + localStorage.getItem(theGameMode + 'ModDraws');
    document.getElementById('scoreTable').style.order = order;
    document.getElementById('scoreTable').style.alignItems = alignment;
}

function increaseTheHistory(theGameMode, whoWon) {
    if (whoWon === '') {
        whoWon = theGameMode + 'ModDraws';
        theIncreaseFunction(whoWon);
    } else {
        whoWon = theGameMode + 'Mod' + whoWon;
        theGameMode += 'ModGames';
        theIncreaseFunction(theGameMode);
        theIncreaseFunction(whoWon);
    }
}

function theIncreaseFunction(theKey) {
    let count = localStorage.getItem(theKey);
    ++count;
    localStorage.setItem(theKey, count);
}

//Function for checking if the game results in a draw
function checkIfDraw() {
    for (let i = 0; i < toWin.length; ++i) {
        let hasX = 0, has0 = 0;
        toWin[i].forEach((element) => {
            if (document.getElementById('theButton' + element).innerText === "X") {
                ++hasX;
            } else if (document.getElementById('theButton' + element).innerText === "0") {
                ++has0;
            }
        });
        if (hasX !== 0 && has0 !== 0) {
            toWin.splice(i, 1);
            --i;
        }
    }
    if (toWin.length < 2) {
        if(toWin.length === 0) {
            thisLooksLikeADraw();
                return
        }
        for (let i = 0; i < 3; ++i) {
            if (document.getElementById('theButton' + toWin[0][i]).innerText !== "") {
                thisLooksLikeADraw();
                return
            }
        }
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
    if (computerHistory.length > 0) {
        increaseTheHistory('sp', '');
        ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '0', 'center');
    } else {
        increaseTheHistory('pvp', '');
        ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '0', 'center');
    }
    setTimeout(function () { theAfterButtons(); }, 1.0 * 2000);
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

//Function for restarting the selected game mode
function restartGame() {
    removeFeatures();
    if (computerHistory.length > 0) {
        computerHistory.splice(0, computerHistory.length);
        singlePlayer();
    } else {
        multiPlayer();
    }
}

//Function that helps to remove the removable features that can pe readded
function removeFeatures() {
    toWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
    document.getElementById('afterButtons').remove();
    document.getElementById('theMessage').remove();
    setOfMovesForPc.splice(0, setOfMovesForPc.length);
    selectTheStrategy.splice(0, selectTheStrategy.length);
}

//Functions for editing the Player1/Player2 info-texts
function editPlayerStatus(theId, ifDisplay, theText, theColor) {
    document.getElementById(theId).style.display = ifDisplay;
    document.getElementById(theId).innerText = theText;
    document.getElementById(theId).style.backgroundColor = theColor;
}

//Function that highlightes the player1/player2 info text for showing who's turn is 
function colorTheTurn() {
    if (moveTurn === 'player1') {
        if (setOfMovesForPc.length === 0) {
            editPlayerStatus('player1', 'flex', "Player 1 has the move", 'green');
            editPlayerStatus('player2', 'flex', "Player 2 waits", 'red');
        } else {
            editPlayerStatus('player1', 'flex', "You have the move", 'green');
            editPlayerStatus('player2', 'flex', "The Computer waits", 'red');
        }
    } else {
        if (setOfMovesForPc.length === 0) {
            editPlayerStatus('player1', 'flex', "Player 1 waits", 'red');
            editPlayerStatus('player2', 'flex', "Player 2 has the move", 'green');
        } else {
            editPlayerStatus('player1', 'flex', "Wait for your turn", 'red');
            editPlayerStatus('player2', 'flex', "The Computer has the move", 'green');
        }
    }
}

//Function for editing the message with Win/Draw context
function messageTheResult(theText, theColor) {
    const theMessage = document.createElement('h4');
    theMessage.innerText = theText;
    theMessage.style.color = theColor;
    theMessage.id = 'theMessage';
    document.getElementById('playerTurn').appendChild(theMessage);
}

//Sa curat functiile + sa curat css ++ sa reorganizez functiile in ordine(ultimele sunt cele de editare)