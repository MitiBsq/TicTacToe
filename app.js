//Declaring the Global variables
const p1MoveHistory = new Array();
const p2MoveHistory = new Array();
const potentialMovesForP1 = new Array();
const potentialMovesForP2 = new Array();
let vsComputer=0;
let moveTurn;
//Array with the winning combinations
const toWin = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [3, 4, 5], [6, 7, 8]];
document.getElementById('gameInterface').style.display = 'none';
document.getElementById('spMode').addEventListener('click', singlePlayer);

function singlePlayer() {
    vsComputer='yes';
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
        editPlayer1("Test start: \n X", 'green');
        editPlayer2("Computer waits: \n 0", 'red');
        //Vezi ca e schimbat moveturn la player2
        moveTurn='player2';
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
        });
    }
    if (vsComputer==='yes' && moveTurn==='player2' ) {
        generateTheStrategy();
        setTimeout(function () {computerMoves();}, 1.0*3000)
    }
}

function buttonClick(p1PlayWith, p2PlayWith, theButton) {
    if(moveTurn === 'player1') {
        document.getElementById('theButton' + theButton).innerText = p1PlayWith;
        p1MoveHistory.push(theButton);
        if (p1MoveHistory.length >= 3) {
            didYouWon(potentialMovesForP1, p1MoveHistory);
        }
        analyseTheMove(theButton, potentialMovesForP1);
        compareTheMoves(potentialMovesForP2, theButton);
        moveTurn='player2'; 
        if (vsComputer==='yes') {
            generateTheStrategy();
            setTimeout(function() {computerMoves();}, 1.0*3000); 
        }
    } else {
        document.getElementById('theButton' + theButton).innerText = p2PlayWith;
        p2MoveHistory.push(theButton);
        if (p2MoveHistory.length >= 3) {
            didYouWon(potentialMovesForP2, p2MoveHistory);
        }
        analyseTheMove(theButton, potentialMovesForP2);
        compareTheMoves(potentialMovesForP1, theButton);
        console.log(potentialMovesForP2)
        moveTurn='player1';
        
    }
}


/* function disableOrNot(theValue) {
    for (let i = 0 ; i < 9 ; ++i) {
        document.getElementById('theButton' + i).disabled=theValue;
    }
} */



function analyseTheMove(theButton, theSpecificArray) {
    for (let winningComb = 0; winningComb < toWin.length; ++winningComb) {
        for (let theNumber = 0; theNumber < 3; ++theNumber) {
            if (toWin[winningComb][theNumber] === theButton) {
                if(moveTurn==='player2'){
                    console.log(toWin[winningComb])
                }
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

let selectTheStrategy;
let copyOfTheStrategy;
function generateTheStrategy() {
    if (potentialMovesForP2.length===0){
        selectTheStrategy=toWin[Math.floor(Math.random() * toWin.length)];
        copyOfTheStrategy=selectTheStrategy;
    } else {
        let count = 0;
        potentialMovesForP2.forEach((element) => {
            if (element === selectTheStrategy) {
                ++count;
            }
        });
        if (count === 0) {
            selectTheStrategy = potentialMovesForP2[Math.floor(Math.random() * potentialMovesForP2.length)];
            copyOfTheStrategy=selectTheStrategy;
        } 
    } 
}   

//The computer is considered the second player
//Function for genereting the computer moves
function computerMoves() {
    let selectedMove;
    let randomNumber=Math.floor(Math.random() * copyOfTheStrategy.length);
    selectedMove = copyOfTheStrategy[randomNumber];
     if (document.getElementById('theButton' + selectedMove).disabled === false) {
        document.getElementById('theButton' + selectedMove).click();
        copyOfTheStrategy.splice(randomNumber);
     } else {
        computerMoves();
     }
}


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
            /* console.log(potentialWin) */
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