//Declaring the Global variables
const p1MoveHistory = new Array();
const p2MoveHistory = new Array();
const potentialMovesForP1 = new Array();
const potentialMovesForP2 = new Array();
let moveTurn;
//Array with the winning combinations
const toWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
document.getElementById('gameInterface').style.display = 'none';
document.getElementById('spMode').addEventListener('click', singlePlayer);

function singlePlayer() {
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
        moveTurn='player1';
        return ['X', '0'];
    } else {
        editPlayer1("Wait for your turn: \n 0", 'red');
        editPlayer2("Computer starts: \n X", 'green');
        moveTurn='player2';
        return ['0', 'X'];
    }
}


function createGame(p1PlayWith, p2PlayWith) {
    const theButtons = new Array();
    for (let i = 0; i < 9; ++i) {
        theButtons[i] = document.createElement('button');
        theButtons[i].id = "theButton" + i;
        theButtons[i].className = 'editButtons';
        theButtons[i].innerText = '';
        document.getElementById('theGame').appendChild(theButtons[i]);
        if (i === 2 || i === 5) {
            document.getElementById('theGame').appendChild(document.createElement('br'));
        }
        theButtons[i].addEventListener('click', () => {
            buttonClick(p1PlayWith, p2PlayWith, i);
            theButtons[i].disabled = true;
             /* if (p1MoveHistory.length >= 3) {
                didYouWon(potentialMovesForP1, p1MoveHistory);
                startGame(p1PlayWith, p2PlayWith, i);
            } else {
                startGame(p1PlayWith, p2PlayWith, i);
            } */
        })
    }
}

function buttonClick(p1PlayWith, p2PlayWith, theButton) {
    if(moveTurn === 'player1') {
        document.getElementById('theButton' + theButton).innerText = p1PlayWith;
        p1MoveHistory.push(theButton);
        analyseTheMove(theButton, potentialMovesForP1);
        compareTheMoves(potentialMovesForP2, theButton);
        moveTurn='player2'; 
    } else {
        document.getElementById('theButton' + theButton).innerText = p2PlayWith;
        p2MoveHistory.push(theButton);
        analyseTheMove(theButton, potentialMovesForP2);
        compareTheMoves(potentialMovesForP1, theButton);
        moveTurn='player1';
    }
    console.log(potentialMovesForP1, potentialMovesForP2)
}

/* 
function startGame(p1PlayWith, p2PlayWith, theButton) {
    document.getElementById('theButton' + theButton).innerText = p1PlayWith;
    analyseTheMove(theButton, potentialMovesForP1);
    generateTheStrategy(theButton);
    setTimeout(function () {computerMoves(p2PlayWith)}, 1.0*1000);
} */

/* function disableOrNot(theValue) {
    for (let i = 0 ; i < 9 ; ++i) {
        document.getElementById('theButton' + i).disabled=theValue;
    }
} */

//Function for analysing the remaining moves of the computer


function analyseTheMove(theButton, theSpecificArray) {
    for (let winningComb = 0; winningComb < toWin.length; ++winningComb) {
        for (let theNumber = 0; theNumber < 3; ++theNumber) {
            if (toWin[winningComb][theNumber] === theButton) {
                theSpecificArray.push(toWin[winningComb]);
                toWin.splice(winningComb,1);
                winningComb--;
                break;
            }    
        }
    }
}

function compareTheMoves(theSpecificArray, theButton) {
    for (let i = 0; i < theSpecificArray.length; ++i) {
        for (let j = 0; j < 3; ++j) {
            if (theSpecificArray[i][j] === theButton) {
                theSpecificArray.splice(i, 1);
                i = 0;
                break;
            }
        }
    }
}

/* function analyseTheMove(theButton) {
    if (potentialMovesForP2 == 0) {
        toWin.forEach((winningComb) => {
            for (let i = 0; i < 3; ++i) {
                if (winningComb[i] === theButton) {
                    potentialMovesForP1.push(winningComb);
                    break;
                }
                if (i === 2) {
                    potentialMovesForP2.push(winningComb);
                }
            }
        });
    } else {
        for (let i = 0; i < potentialMovesForP2.length; ++i) {
            for (let j = 0; j < 3; ++j) {
                if (potentialMovesForP2[i][j] === theButton) {
                    potentialMovesForP1.push(potentialMovesForP2[i]);
                    potentialMovesForP2.splice(i, 1);
                    i = 0;
                }
            }
        }
    }
} */


/* let remainingCount = potentialMovesForP2.length;
function computerMoves(p2PlayWith) {
    let selectedMove = selectTheStrategy[Math.floor(Math.random() * 3)];
     if (document.getElementById('theButton' + selectedMove).innerText==='') {
        document.getElementById('theButton' + selectedMove).innerText = p2PlayWith;
        document.getElementById('theButton' + selectedMove).disabled = true;
        p2MoveHistory.push(selectedMove);
        if(p2MoveHistory.length >=3) {
            didYouWon(potentialMovesForP2, p2MoveHistory);
        }
    } else {
        computerMoves(p2PlayWith);
    } 
    if (document.getElementById('theButton' + selectedMove).disabled===false) {
        document.getElementById('theButton' + selectedMove).click();
    }

}

let selectTheStrategy = 0;
function generateTheStrategy(theButton) {
    if (selectTheStrategy === 0) {
        selectTheStrategy = potentialMovesForP2[Math.floor(Math.random() * potentialMovesForP2.length)];
        return;
    }
    let count = 0;
    potentialMovesForP2.forEach((element) => {
        if (element === selectTheStrategy) {
            ++count;
        }
    });
    if (count === 0) {
        selectTheStrategy = potentialMovesForP2[Math.floor(Math.random() * potentialMovesForP2.length)];
    }
} */

function didYouWon(theSetOfMoves, theHistoryofMoves) {
    theSetOfMoves.forEach((potentialWin) => {
        let winCount=0;
          for (let i = 0 ; i < 3 ; i++) {
            theHistoryofMoves.forEach((theMove) => {
                if(potentialWin[i] === theMove) {
                    ++winCount;
                    /* theMove++; */
                }
            });
        }  
        if (winCount === 3) {
            console.log(potentialWin)
            theWinnerIs(potentialWin);
        }
    });
}


function theWinnerIs(theWinningButtons) {
    for(let i = 0 ; i < 9 ; i++) {
        document.getElementById('theButton' + i).disabled=true;
    }
    for (let i = 0 ; i < 3 ; i++) {
        document.getElementById('theButton' + theWinningButtons[i]).style.backgroundColor='green';
    }
    document.getElementById('player1').style.display='none';
    document.getElementById('player2').style.display='none';
    document.getElementById('playerTurn').innerText='Congratulation, You won'
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


//Sa fac functia de restart joc
//Sa fac tabela de scor

//Sa rebag calculatoru la noile functii(miscarile lui sa fie cu button.click() si sa il ia ca si player2)