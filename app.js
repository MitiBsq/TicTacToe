//Declaring the Global variables
const potentialMovesForP1 = new Array();
const potentialMovesForP2 = new Array();
const computerHistory = new Array();
let vsComputer = 0;
let moveTurn;
//Array with the winning combinations
const toWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
document.getElementById('gameInterface').style.display = 'none';
document.getElementById('spMode').addEventListener('click', singlePlayer);

function singlePlayer() {
    vsComputer = 'yes';
    document.getElementById('gameInterface').style.display = 'initial';
    document.getElementById('infoGameMode').innerText = "Single Player Mode";
    document.getElementById('chooseGameMode').style.display = 'none';
    document.getElementById('player1').innerText = "You";
    document.getElementById('player2').innerText = "Computer";
    document.getElementById('iStart').addEventListener('click', randomOrNot);
    document.getElementById('randomStart').addEventListener('click', () => {
        randomOrNot("random");
    });
}

//Event function for selecting sides buttons
function randomOrNot(random) {
    document.getElementById('easyWay').style.display = 'none';
    let [p1PlayWith, p2PlayWith] = whoIsWhat(random);
    createGame(p1PlayWith, p2PlayWith);
}

//Function for selecting the player who starts with "X"
function whoIsWhat(random) {
    if (Math.floor(Math.random() * 2) === 0 || random !== "random") {
        editPlayer1("You start: \n X", 'green');
        editPlayer2("Computer waits: \n 0", 'red');
        moveTurn = 'player1';
        return ['X', '0'];
    } else {
        editPlayer1("Wait for your turn: \n 0", 'red');
        editPlayer2("Computer starts: \n X", 'green');
        moveTurn = 'player2';
        return ['0', 'X'];
    }
}


function createGame(p1PlayWith, p2PlayWith) {
    const theButtons = new Array();
    for (let i = 0; i < 9; ++i) {
        theButtons[i] = document.createElement('button');
        theButtons[i].id = "theButton" + i;
        theButtons[i].className = 'editButtons';
        document.getElementById('theGame').appendChild(theButtons[i]);
        if (i === 2 || i === 5) {
            document.getElementById('theGame').appendChild(document.createElement('br'));
        }
        theButtons[i].addEventListener('click', () => {
            buttonClick(p1PlayWith, p2PlayWith, i);
            theButtons[i].disabled = true;
        });
    }
    if (vsComputer === 'yes' && moveTurn === 'player2') {
        generateTheStrategy();
        setTimeout(function () { computerMoves(); }, 1.0 * 1000)
    }
}

function buttonClick(p1PlayWith, p2PlayWith, theButton) {
    if (moveTurn === 'player1') {
        document.getElementById('theButton' + theButton).innerText = p1PlayWith;
        analyseTheMove(theButton);
        didYouWon(p1PlayWith);
        moveTurn = 'player2';
        if (vsComputer === 'yes') {
            generateTheStrategy();
            setTimeout(function () { computerMoves(); }, 1.0 * 2000);
        }
    } else {
        document.getElementById('theButton' + theButton).innerText = p2PlayWith;
        didYouWon(p2PlayWith);
        moveTurn = 'player1';
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

//Trebuie modificat la pcMoves pt ca nu mai este p2strategy
let setOfMovesForPc = new Array();
function analyseTheMove(theButton) {
    if (setOfMovesForPc.length === 0) {
        toWin.forEach((winningComb) => {
            let count = 0;
            winningComb.forEach((theNumber) => {
                if (theNumber === theButton) {
                    ++count;
                }
            });
            if (count === 0) {
                setOfMovesForPc.push(winningComb);
            }
        })
    } else {
        for (let i = 0; i < setOfMovesForPc.length; ++i) {
            setOfMovesForPc[i].forEach((theNumber) => {
                if (theNumber === theButton) {
                    setOfMovesForPc.splice(i, 1);
                    i--;
                }
            })
        }
    }
}

let selectTheStrategy = new Array();
function generateTheStrategy() {
    if (setOfMovesForPc.length === 0) {
        selectTheStrategy = toWin[Math.floor(Math.random() * toWin.length)];
    } else {
        if (selectTheStrategy.length === 0) {
            selectTheStrategy = setOfMovesForPc[Math.floor(Math.random() * setOfMovesForPc.length)];
        } else {
            if (!setOfMovesForPc.includes(selectTheStrategy)) {
                setOfMovesForPc.forEach((strategy) => {
                    strategy.forEach((elementOfStr) => {
                        computerHistory.forEach((historyElem) => {
                            if (historyElem === elementOfStr) {
                                selectTheStrategy = strategy;
                                return;
                            }
                        });
                    });
                })
            }
        }
    }
}

function computerMoves() {
    let selectedMove = selectTheStrategy[Math.floor(Math.random() * selectTheStrategy.length)];
    console.log('strategy', selectTheStrategy);
    console.log('theMove', selectedMove);
    if (document.getElementById('theButton' + selectedMove).disabled === false) {
        computerHistory.push(selectedMove);
        document.getElementById('theButton' + selectedMove).click();
    } else {
        computerMoves();
    }
}


//Merge!!!!
//Vezi de ce variabile poti scapa(movehistory si poate si potential moves(ai grija daca scapi ce faci cu computerul))
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
        }
    });
}

function theWinnerIs(theWinningButtons) {
    disableOrNot('true');
    vsComputer = 'stop';
    for (let i = 0; i < 3; i++) {
        document.getElementById('theButton' + theWinningButtons[i]).style.backgroundColor = 'green';
    };
    document.getElementById('player1').style.display = 'none';
    document.getElementById('player2').style.display = 'none';
    document.getElementById('playerTurn').innerText = 'Congratulation, You won'
}

//Functions for editing the Player1/Player2 info-texts
function editPlayer1(theText, theColor) {
    document.getElementById('player1').innerText = theText;
    document.getElementById('player1').style.backgroundColor = theColor;
}

function editPlayer2(theText, theColor) {
    document.getElementById('player2').innerText = theText;
    document.getElementById('player2').style.backgroundColor = theColor;
}

//Vezi in alt branch
/* document.getElementById('pvpMode').addEventListener('click', multiPlayer); */
/* function multiPlayer() {
    document.getElementById('infoText').innerText="MultiPlayer Mode";
    document.getElementById('chooseGameMode').style.display='none';
} */


//Sa fac partea de daca e egal
//Bonus sa fac mode hard pentru cand joci contra pc sa nu il poti bate(cand tu incepi)
//{Sa il fac sa iti ia miscarile castigatoare si sa puna acolo(sa inceapa din mijloc?)}

//Sa fac functia de restart joc
//Sa fac tabela de scor
//Sa fac sa se schimbe culoarea la cine e tura

//Sa curat functiile