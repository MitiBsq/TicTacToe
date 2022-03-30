//Array with the winning combinations
let NecessaryToWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];

//The main function for multi-player mode
document.getElementById('pvpMode').addEventListener('click', multiPlayer);
function multiPlayer() {
    ScoreTableHistory('Your history in Player vs Player Mod:', 'pvp', '5', 'start');
    displayTheGame("MultiPlayer Mode", 'none');
    editPlayerStatus('player1', 'flex', 'Player 1', 'transparent');
    editPlayerStatus('player2', 'flex', 'Player 2', 'transparent');
    whoIsWhat("pvpMode(p1PlayWith, p2PlayWith, i)", 'random');
}

//The main function for single player mode
let setOfMovesForPc = new Array();
document.getElementById('spMode').addEventListener('click', singlePlayer);
function singlePlayer() {
    setOfMovesForPc = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
    ScoreTableHistory('Your history in Player vs Computer Mod:', 'sp', '0', 'center');
    displayTheGame("Single Player Mode", 'flex');
    editPlayerStatus('player1', 'flex', 'You', 'transparent');
    editPlayerStatus('player2', 'flex', 'Computer', 'transparent');
    document.getElementById('iStart').addEventListener('click', randomNot);
    document.getElementById('randomStart').addEventListener('click', randomYes);
    document.getElementById('hardMode').addEventListener('click', callingHard);
}

//Event Functions for the 3 single player dificulties
function randomYes() {
    whoIsWhat("easyMode", 'random');
}

function randomNot() {
    whoIsWhat("easyMode");
}

function callingHard() {
    document.getElementById('scoreTable').style.display = 'none';
    document.getElementById('infoGameMode').innerText = "Single Player Mode\n HardMode";
    whoIsWhat("hardMode");
}

//Function for selecting the player who starts with "X" and the one with "0"
let moveTurn;
function whoIsWhat(theDificulty, random) {
    let p1PlayWith, p2PlayWith;
    if (Math.floor(Math.random() * 2) === 0 || random !== 'random') {
        moveTurn = 'player1';
        colorTheTurn();
        [p1PlayWith, p2PlayWith] = ['X', '0'];
    } else {
        moveTurn = 'player2';
        colorTheTurn();
        [p1PlayWith, p2PlayWith] = ['0', 'X'];
    }
    //(In easyMode if the computer has the first move)
    if (theDificulty[0] === 'e' && moveTurn === 'player2') {
        generateTheStrategy();
        setTimeout(function () { computerMoves(); }, 1.0 * 1000);
    }
    createButtons(theDificulty, p1PlayWith, p2PlayWith);
    document.getElementById('easyWay').style.display = 'none';
}

//Function for creating the game(genereting the game-table buttons)
function createButtons(theDificulty, p1PlayWith, p2PlayWith) {
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
            theClick(theDificulty, p1PlayWith, p2PlayWith, i)
            theButtons[i].disabled = true;
        });
    }
}

//The main event-function for clicking the square(the button)
function theClick(whatMode, p1PlayWith, p2PlayWith, theButton) {
    if (moveTurn === 'player1') {
        applyTheClick(theButton, p1PlayWith, 'player2');
        if (whatMode === 'hardMode') {
            setTimeout(function () { pcHardMoves(); }, 1.0 * 1000);
        } else if (whatMode === 'easyMode') {
            analyseTheMove(theButton);
            generateTheStrategy();
            setTimeout(function () { computerMoves(); }, 1.0 * 1000);
        }
    } else {
        applyTheClick(theButton, p2PlayWith, 'player1');
    }
}

//Function for applying the features of "theClick" function from above
function applyTheClick(theButton, whoPressed, whoIsNext) {
    document.getElementById('theButton' + theButton).innerText = whoPressed;
    moveTurn = whoIsNext;
    colorTheTurn();
    didYouWon(whoPressed);
}

//Function for generating the moves of the computer in HardMode(vs Computer in HardMode ONLY)
const computerHistory = new Array();
function pcHardMoves() {
    //Initiating hir fist move(either the middle square or one of the corners)
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
        //Creating the counter-moves against the player(either winning or drawing)
        let newMove = new Object();
        for (let i = 0; i < NecessaryToWin.length; ++i) {
            let check = 0;
            let checkWin = 0;
            let missingMove = 0;
            //If the players has the potential for a winning combination (1 move left) the computer blocks his move, if the computer has 1 move left to win that move is instead the choice
            for (let j = 0; j < 3; ++j) {
                if (document.getElementById('theButton' + NecessaryToWin[i][j]).innerText === 'X') {
                    ++check;
                } else if (document.getElementById('theButton' + NecessaryToWin[i][j]).innerText === '0') {
                    ++checkWin;
                }
            }
            //If winnable
            if (checkWin > 1) {
                for (let j = 0; j < 3; ++j) {
                    if (document.getElementById('theButton' + NecessaryToWin[i][j]).innerText === '') {
                        missingMove = NecessaryToWin[i][j];
                    }
                }
                document.getElementById('theButton' + missingMove).click();
                return
            } else if (check > 1) {
                for (let j = 0; j < 3; ++j) {
                    if (document.getElementById('theButton' + NecessaryToWin[i][j]).innerText === '') {
                        missingMove = NecessaryToWin[i][j];
                    }
                }
                document.getElementById('theButton' + missingMove).click();
                return
            }
            //If no winnable or equaliser move is proccesed
            if (check === 0) {
                for (let j = 0; j < 3; ++j) {
                    if (document.getElementById('theButton' + NecessaryToWin[i][j]).innerText === '0') {
                        ++check;
                    }
                }
                //Adding a backup set of moves  for the case above(adding the moves in order)
                newMove[check] = NecessaryToWin[i];
            }
        }
        //Applying the backup moves
        if (moveTurn === 'player2') {
            //If only 1 set of moves is available 
            if (Object.keys(newMove).length === 1) {
                for (let i = 0; i < 3; ++i) {
                    if (document.getElementById('theButton' + Object.values(newMove)[0][i]).innerText === '') {
                        document.getElementById('theButton' + Object.values(newMove)[0][i]).click();
                        return
                    }
                }
            } else if (Object.keys(newMove).length > 1) {
                //If there are more set of moves added the set is added  ascended so that  the set with the most moves is choosed 
                for (let i = 0; i < 3; ++i) {
                    if (document.getElementById('theButton' + Object.values(newMove)[1][i]).innerText === '') {
                        document.getElementById('theButton' + Object.values(newMove)[1][i]).click();
                        return
                    }
                }
            }
        }
    }
}

//Function for analysing the movement of the player1(vs Computer in EasyMode ONLY)
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

//Function for generating the strategy for computer(vs Computer in EasyMode ONLY)
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

//Function for generating the move of the computer(vs Computer in EasyMode ONLY)
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
    for (let i = 0; i < 9; ++i) {
        if (document.getElementById('theButton' + i).innerText === theSymbolOfPlayer) {
            historyMoves.push(i);
        }
    }
    for (let i = 0; i < NecessaryToWin.length; ++i) {
        let winCount = 0;
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < historyMoves.length; ++k) {
                if (NecessaryToWin[i][j] === historyMoves[k]) {
                    ++winCount;
                    break
                }
            }
        }
        if (winCount === 3) {
            theWinnerIs(NecessaryToWin[i]);
            return
        }
    }
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
    moveTurn = '';
    setTimeout(function () { theAfterButtons(); }, 1.0 * 2000);
}

//Function for checking if the game results in a draw
function checkIfDraw() {
    for (let i = 0; i < NecessaryToWin.length; ++i) {
        let hasX = 0, has0 = 0;
        NecessaryToWin[i].forEach((element) => {
            if (document.getElementById('theButton' + element).innerText === "X") {
                ++hasX;
            } else if (document.getElementById('theButton' + element).innerText === "0") {
                ++has0;
            }
        });
        if (hasX !== 0 && has0 !== 0) {
            NecessaryToWin.splice(i, 1);
            --i;
        }
    }
    if (NecessaryToWin.length === 0) {
        thisLooksLikeADraw();
        return
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

//Function for creating the restart + back buttons
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

//Function for rejoining the main menu hub
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

//Function for showing the game history against the respective player
function ScoreTableHistory(theText, theGameMode, order, alignment) {
    document.getElementById('scoreTableText').innerText = theText;
    document.getElementById('games').innerText = 'Games: ' + localStorage.getItem(theGameMode + 'ModGames');
    document.getElementById('winsP1').innerText = 'Player 1 Wins: ' + localStorage.getItem(theGameMode + 'ModP1Wins');
    document.getElementById('winsP2').innerText = 'Player 2 Wins: ' + localStorage.getItem(theGameMode + 'ModP2Wins');
    document.getElementById('draws').innerText = 'Draws: ' + localStorage.getItem(theGameMode + 'ModDraws');
    document.getElementById('scoreTable').style.order = order;
    document.getElementById('scoreTable').style.alignItems = alignment;
    document.getElementById('scoreTable').style.display = 'flex';
}

//The set of Functions for increasing the history numbers
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

//The appealed function from above
function theIncreaseFunction(theKey) {
    let count = localStorage.getItem(theKey);
    ++count;
    localStorage.setItem(theKey, count);
}

//Function that helps to remove the removable features that can pe readded
function removeFeatures() {
    NecessaryToWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
    document.getElementById('afterButtons').remove();
    document.getElementById('theMessage').remove();
    setOfMovesForPc.splice(0, setOfMovesForPc.length);
    selectTheStrategy.splice(0, selectTheStrategy.length);
}

//Function for helping the gameInterface functions
function displayTheGame(infoText, easyWayDisplay) {
    document.getElementById('infoGameMode').innerText = infoText;
    document.getElementById('easyWay').style.display = easyWayDisplay;
    document.getElementById('chooseGameMode').style.display = 'none';
    document.getElementById('gameInterface').style.display = 'flex';
}

//Functions for editing the Player1/Player2 info-texts
function editPlayerStatus(theId, ifDisplay, theText, theColor) {
    document.getElementById(theId).style.display = ifDisplay;
    document.getElementById(theId).innerText = theText;
    document.getElementById(theId).style.backgroundColor = theColor;
}

//Function for disabling all the buttons(for showing the game results)
function disableOrNot(theValue) {
    for (let i = 0; i < 9; ++i) {
        document.getElementById('theButton' + i).disabled = theValue;
    }
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