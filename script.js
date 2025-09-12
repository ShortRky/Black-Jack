let deck = [];
let dealerSum = 0;
let playerSum = 0;
let dealerAceCount = 0;
let playerAceCount = 0;
let hidden;
let canHit = true;
let balance = 2000;
let currentBet = 0;

window.onload = function() {
    buildDeck();
    shuffleDeck();
    document.getElementById("balance").innerText = balance;
    
    document.getElementById("dealButton").addEventListener("click", startGame);
    document.getElementById("hitButton").addEventListener("click", hit);
    document.getElementById("standButton").addEventListener("click", stand);
    document.getElementById("borrowButton").addEventListener("click", borrowMoney);
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["♠", "♣", "♥", "♦"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push({
                value: values[j],
                type: types[i],
                isRed: types[i] === "♥" || types[i] === "♦"
            });
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    const betAmount = parseInt(document.getElementById("betAmount").value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Please enter a valid bet amount!");
        return;
    }

    currentBet = betAmount;
    balance -= betAmount;
    document.getElementById("balance").innerText = balance;

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("player-cards").innerHTML = "";
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("player-sum").innerText = "";
    document.getElementById("messages").innerText = "";

    canHit = true;
    dealerSum = 0;
    playerSum = 0;
    dealerAceCount = 0;
    playerAceCount = 0;

    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    createCard("dealer-cards", "hidden", "?");
    let card = deck.pop();
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    createCard("dealer-cards", card.value + card.type, card.isRed);

    for (let i = 0; i < 2; i++) {
        let card = deck.pop();
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        createCard("player-cards", card.value + card.type, card.isRed);
    }

    document.getElementById("hitButton").disabled = false;
    document.getElementById("standButton").disabled = false;
    document.getElementById("dealButton").disabled = true;
    
    document.getElementById("player-sum").innerText = playerSum;
    
    if (playerSum === 21) {
        stand();
    }
}

function hit() {
    if (!canHit) return;

    let card = deck.pop();
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    createCard("player-cards", card.value + card.type, card.isRed);

    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }

    document.getElementById("player-sum").innerText = playerSum;

    if (playerSum > 21) {
        canHit = false;
        document.getElementById("hitButton").disabled = true;
        stand();
    }
}

function stand() {
    document.getElementById("hitButton").disabled = true;
    document.getElementById("standButton").disabled = true;
    document.getElementById("dealButton").disabled = false;
    canHit = false;

    document.getElementById("dealer-cards").firstChild.textContent = hidden.value + hidden.type;
    if (hidden.isRed) {
        document.getElementById("dealer-cards").firstChild.classList.add("red");
    }

    while (dealerSum < 17) {
        let card = deck.pop();
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        createCard("dealer-cards", card.value + card.type, card.isRed);

        while (dealerSum > 21 && dealerAceCount > 0) {
            dealerSum -= 10;
            dealerAceCount -= 1;
        }
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    let message = "";

    if (playerSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You Win!";
        balance += currentBet * 2;
    }
    else if (playerSum === dealerSum) {
        message = "Tie!";
        balance += currentBet;
    }
    else if (playerSum > dealerSum) {
        message = "You Win!";
        balance += currentBet * 4;
    }
    else {
        message = "You Lose!";
    }

    document.getElementById("messages").innerText = message;
    document.getElementById("balance").innerText = balance;

    if (deck.length < 10) {
        buildDeck();
        shuffleDeck();
    }
}

function getValue(card) {
    if (card.value === "A") return 11;
    return ["J", "Q", "K"].includes(card.value) ? 10 : parseInt(card.value);
}

function checkAce(card) {
    return card.value === "A" ? 1 : 0;
}

function createCard(parentId, value, isRed) {
    let card = document.createElement("div");
    card.className = "card" + (isRed ? " red" : "");
    card.innerText = value;
    document.getElementById(parentId).appendChild(card);
}

function borrowMoney() {
    const amount = parseInt(document.getElementById("borrowAmount").value);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount to borrow!");
        return;
    }
    
    balance += amount;
    document.getElementById("balance").innerText = balance;
    document.getElementById("borrowAmount").value = "";
}