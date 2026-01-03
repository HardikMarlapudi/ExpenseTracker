const balance = document.getElementById("totalBalance");
const money_plus = document.getElementById("moneyPlus");
const money_minus = document.getElementById("moneyMinus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const transactionName = document.getElementById("transactionName");
const amount = document.getElementById("amountInput");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Add transaction
function transaction(e) {
    e.preventDefault();

    if (transactionName.value.trim() === "" || amount.value.trim() === "") {
        alert("Please enter name and amount.");
        return;
    }

    const newTransaction = {
        id: generateId(),
        text: transactionName.value,
        amount: +amount.value,
    };

    transactions.push(newTransaction);

    addTransactionToDOM(newTransaction);
    updateValues();
    updateLocalStorage();

    transactionName.value = "";
    amount.value = "";
}

// Add transaction to DOM
function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        <div class="recentTransactions">
        ${transaction.text} 
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="deleteBtn" onclick="removeTransaction(${transaction.id})">Delete</button>
        <button class="editBtn" onclick="editTransaction(${transaction.id})">Edit</button>
    `;

    list.appendChild(item);
}

// Update balance, income, expense
function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
}

// Remove transaction
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();
    init();
}

// Update localStorage
function updateLocalStorage() {
   localStorage.setItem("transaction", JSON.stringify(transactions));
}

// Init app
function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

// Generates a unique id
function generateId() {
    return [Math.floor(Math.random() * 1000000000)];
}

form.addEventListener("submit", transaction);
