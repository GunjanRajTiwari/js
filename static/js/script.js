// Challenge 1: Your Age in Days

function ageInDays() {
    var birthYear = prompt('Year: ');
    var result = (2020-birthYear) * 365;
    document.getElementById('flex-box-result').innerHTML="<h1>You are "+result+" days old</h1>"   
}

function reset() {
    document.getElementById('flex-box-result').innerHTML=''
}

// Challenge 2: Rock Paper Scissors

function rpsGame(choice) {
    var message, color;
    var choices = ['rock','paper','scissors']
    var humanChoice = choice.id
    var botChoice = choices[Math.floor(Math.random()*3)]

    result = declareWinner(humanChoice,botChoice);

    if(result == 1){
        message='You Won!'
        color='green'
    }else if(result == 0){
        message='You Lost!'
        color='red'
    }else{
        message='Its a Draw!'
        color='yellow'
    }

    rpsFrontEnd(humanChoice,botChoice,message,color);
}

function declareWinner(humanChoice,botChoice){
    var database={
        'rock':{'scissors':1, 'rock':0.5, 'paper':0},
        'paper':{'scissors':0, 'rock':1, 'paper':0.5},
        'scissors':{'scissors':0.5, 'rock':0, 'paper':1},
    }

    var score = database[humanChoice][botChoice]
    return score
}

function rpsFrontEnd(humanChoice,botChoice,message,color){
    var imageDatabase = {
        'rock' : document.getElementById('rock').src,
        'paper' : document.getElementById('paper').src,
        'scissors' : document.getElementById('scissors').src,
    }

    document.getElementById("rock").remove();
    document.getElementById("paper").remove();
    document.getElementById("scissors").remove();

    var humanDiv = document.createElement('div');
    var messageDiv = document.createElement('div');
    var botDiv = document.createElement('div');

    humanDiv.innerHTML = "<img src='" + imageDatabase[humanChoice] + "' height=150 width=150 style='box-shadow: 0px 10px 50px rgba(50,100,200,1);'>"
    messageDiv.innerHTML = "<h1 style='color:" + color + "; font-size: 60px; padding: 30px; '>"+message+"</h1>"
    botDiv.innerHTML = "<img src='" + imageDatabase[botChoice] + "' height=150 width=150 style='box-shadow: 0px 10px 50px rgba(200,100,50,1);'>"

    document.getElementById("rps-div").appendChild(humanDiv);
    document.getElementById("rps-div").appendChild(messageDiv);
    document.getElementById("rps-div").appendChild(botDiv);
}

// Blackjack challenge
let blackjackGame = {
    'you' : {'div': '.your-box', 'score-span': '#you', 'score':0},
    'dealer' : {'div': '.dealer-box', 'score-span': '#dealer', 'score':0},
    'cards' : ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardMap' : {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'J':10,'Q':10,'A':[1,11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0,
    'isStand' : false,
    'turnsOver' : false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a');
const winSound = new Audio('static/sounds/cash.mp3')
const loseSound = new Audio('static/sounds/aww.mp3')

document.querySelector('#hit').addEventListener('click',blackjackHit);
document.querySelector('#stand').addEventListener('click',dealerLogic);
document.querySelector('#deal').addEventListener('click',blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(card,YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function showCard(card,activePlayer){
    if (activePlayer['score'] <= 21){
        let cardImage = document.createElement('img');
        cardImage.src = `static/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}

 function blackjackDeal() {
    if (blackjackGame['turnsOver'] === true) {
        let yourImages = document.querySelector(".your-box").querySelectorAll('img');
        let dealerImages = document.querySelector(".dealer-box").querySelectorAll('img');
   
        for(i=0;i<yourImages.length; i++) {
           yourImages[i].remove();
        }
   
        for(i=0;i<dealerImages.length; i++) {
           dealerImages[i].remove();
        }
    
        YOU['score'] = 0;
        DEALER['score'] = 0
   
        document.querySelector(YOU['score-span']).textContent = 0;
        document.querySelector(DEALER['score-span']).textContent = 0;
   
        document.querySelector(DEALER['score-span']).style.color = 'white';
        document.querySelector(YOU['score-span']).style.color = 'white';
        
        document.querySelector('#blackjack-result').textContent = "Let's Play"
        document.querySelector('#blackjack-result').style.color = "black"

        blackjackGame['turnsOver'] = false;
        blackjackGame['isStand'] = false;
    }
 }

 function randomCard() {
     let randomIndex = Math.floor(Math.random()*13);
     return blackjackGame['cards'][randomIndex];
 }

 function updateScore(card, activePlayer){
     if (card == 'A'){
         if (activePlayer['score'] + blackjackGame['cardMap'][card][1] <=21) {
             activePlayer['score'] += blackjackGame['cardMap'][card][1]
         }else{
            activePlayer['score'] += blackjackGame['cardMap'][card][0]
         }
     }else{
        activePlayer['score'] += blackjackGame['cardMap'][card];
     }
     
 }

 function showScore(activePlayer) {
     if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['score-span']).textContent = 'BUST!'
        document.querySelector(activePlayer['score-span']).style.color = 'red'
     } else {
        document.querySelector(activePlayer['score-span']).textContent = activePlayer['score']
     }
 }

 function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
 }

 async function dealerLogic() {
    if (blackjackGame['isStand'] === false) {
        blackjackGame['isStand'] = true;

        while (DEALER['score'] < 16 && blackjackGame['isStand'] === true) {
            let card = randomCard();
            showCard(card,DEALER);
            updateScore(card, DEALER);
            showScore(DEALER);
            await sleep(500);
        }
    
       
        blackjackGame['turnsOver'] = true;
        let winner = computeWinner();
        showResult(winner);
    }

 }

 // compute winner and return who won
 function computeWinner() {
     let winner;
    
if (YOU['score'] <= 21) {
    if((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
        console.log('You won!');
        winner = YOU;
    } else if (YOU['score'] < DEALER['score']) {
        console.log('You Lost!');
        winner = DEALER;
    } else if ((YOU['score'] == DEALER['score'])) {
        console.log('Its a draw!')
    } 
} else if ((YOU['score'] > 21) && (DEALER['score'] > 21)) {
    console.log('Its a draw!')
} else if ((YOU['score'] > 21) && (DEALER['score'] <= 21)){
    console.log('You Lost!');
    winner = DEALER;
}
     return winner
 }

// update table of wins losses and draws and display result message
function showResult(winner) {
    let message, messageColor;

    if (blackjackGame['turnsOver'] === true) {
        if (winner == YOU) {
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
            blackjackGame['wins']+=1
        } else if (winner == DEALER) {
            message = 'You Lost!';
            messageColor = 'red';
            loseSound.play();
            blackjackGame['losses']+=1
        } else {
            message = 'Its a Draw!';
            messageColor = 'black';
            blackjackGame['draws']+=1
        }
    
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
        document.querySelector('#wins').textContent = blackjackGame['wins']
        document.querySelector('#losses').textContent = blackjackGame['losses']
        document.querySelector('#draws').textContent = blackjackGame['draws']
    
    }
    
}