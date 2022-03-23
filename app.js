//Declaring the Global variables
//Array with the winning combinations
const toWin = [[0,1,2],[0,4,8],[0,3,6],[1,4,7],[2,5,8],[2,4,6],[3,4,5],[6,7,8]];
document.getElementById('gameInterface').style.display='none';
document.getElementById('spMode').addEventListener('click', singlePlayer);

function singlePlayer() {
    document.getElementById('gameInterface').style.display='initial';
    document.getElementById('infoGameMode').innerText="Single Player Mode";
    document.getElementById('chooseGameMode').style.display='none';
    document.getElementById('player1').innerText="You";
    document.getElementById('player2').innerText="Computer";
    document.getElementById('iStart').addEventListener('click', randomOrNot);
    document.getElementById('randomStart').addEventListener('click', () => {
        randomOrNot("random");
    });
}

//Event function for selecting sides buttons
function randomOrNot(random) {
    document.getElementById('easyWay').style.display='none';
    let [p1PlayWith, p2PlayWith] = whoIsWhat(random);
    createGame(p1PlayWith, p2PlayWith);
}

//Function for selecting the player who starts with "X"
function whoIsWhat(random) {
    if (Math.floor(Math.random() * 2)===0 || random !== "random") {
        editPlayer1("You start: \n X", 'green');
        editPlayer2("Computer waits: \n 0", 'red');
        return ['X', '0'];
    } else {
        editPlayer1("Wait for your turn: \n 0", 'red');
        editPlayer2("Computer starts: \n X", 'green');
        return ['0', 'X'];
    }
 }

 //Functions for editing the Player1/Player2 info-texts
 function editPlayer1(theText, theColor) {
    document.getElementById('player1').innerText = theText;
    document.getElementById('player1').style.backgroundColor= theColor;
 }

 function editPlayer2(theText, theColor) {
    document.getElementById('player2').innerText = theText;
    document.getElementById('player2').style.backgroundColor= theColor;
 }
 

function createGame(p1PlayWith, p2PlayWith) {
    const theButtons=new Array();
    for (let i = 0 ; i < 9 ; ++i) {
        theButtons[i]=document.createElement('button');
        theButtons[i].id="theButton" + i;
        theButtons[i].className='editButtons';
        theButtons[i].innerText='';
        document.getElementById('theGame').appendChild(theButtons[i]);
        if (i===2 || i===5 ) {
            document.getElementById('theGame').appendChild(document.createElement('br'));
        }
        theButtons[i].addEventListener('click', () => {
            theButtons[i].disabled='true';
            startGame(p1PlayWith, p2PlayWith, i);
        })
    }
}

function startGame(p1PlayWith, p2PlayWith, theNumber) {
    document.getElementById('theButton' + theNumber).innerText=p1PlayWith;
    analyseTheMove(theNumber);
    generateTheStrategy(theNumber);
    computerMoves(p2PlayWith);
}

function disableOrNot(theValue) {
    for (let i = 0 ; i < 9 ; ++i) {
        document.getElementById('theButton' + i).disabled=theValue;
    }
}

//Function for analysing the remaining moves of the computer
const remainingMoves=new Array();
function analyseTheMove(theNumber) {
    if (remainingMoves == 0) {
        toWin.forEach((primElement) => {
            for (let i = 0 ; i < 3 ; ++i) {
                if(primElement[i]===theNumber) {
                    break;
                }
                 if(i===2) {
                    remainingMoves.push(primElement);
                } 
            }
        });
    } else {
        if(remainingMoves!=0) {
            for ( let i = 0 ; i < remainingMoves.length ; ++i) {
                for ( let j = 0 ; j < 3 ; ++j) {
                    if (remainingMoves[i][j]===theNumber) {
                        remainingMoves.splice(i,1);
                        /* console.log(remainingMoves); */
                        i=0;
                        console.log(i)
                    }
                }
            }
        }
    }  
}


 let remainingCount=remainingMoves.length;
 function computerMoves (p2PlayWith) {
     /* console.log(selectTheStrategy); */
    while (true) {
        let selectedMove = selectTheStrategy[Math.floor(Math.random() * 3)];
        if ( document.getElementById('theButton' + selectedMove).innerText === '') {
            document.getElementById('theButton' + selectedMove ).innerText=p2PlayWith;
            document.getElementById('theButton' + selectedMove ).disabled='true';
            break;
         }
    }

    /*  for (let i = 0 ; i < 3 ; ++i) {
         let selectedMove = selectTheStrategy[i];
         if ( document.getElementById('theButton' + selectedMove).innerText === '') {
            document.getElementById('theButton' + selectedMove ).innerText=p2PlayWith;
            break;
         } 
     } */
     
     
} 
 
let selectTheStrategy=0;
function generateTheStrategy(theNumber) {
    if (selectTheStrategy === 0) {
        selectTheStrategy = remainingMoves[Math.floor(Math.random() * remainingMoves.length)];
        return;
     }
     let count=0;
     remainingMoves.forEach((element) => {
         if(element === selectTheStrategy) {
             ++count;
         }
     });
     if (count === 0) {
        selectTheStrategy = remainingMoves[Math.floor(Math.random() * remainingMoves.length)];
     }
}

//Vezi in alt branch
/* document.getElementById('pvpMode').addEventListener('click', multiPlayer); */
/* function multiPlayer() {
    document.getElementById('infoText').innerText="MultiPlayer Mode";
    document.getElementById('chooseGameMode').style.display='none';
} */

//Sa fac o functie chooseTurn in care sa se aleaga cine 'muta' + sa dea highlight la id-ul carui jucator ii este tura
//Sa fac functia de calculare miscari computer!!
//Sa fac functia de restart joc
//Sa fac tabela de scor

//Vezi ca da erroare cand intri peste miscarile la pc