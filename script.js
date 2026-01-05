const balance = document.getElementById("totalBalance");
const money_plus = document.getElementById("moneyPlus");
const money_minus = document.getElementById("moneyMinus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const transactionName = document.getElementById("transactionName");
const amount = document.getElementById("amountInput");

const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));

let transactions = localStorageTransactions !== null ? localStorageTransactions : [];

// Adding a transcaction
function transaction(e) {
    e.preventDefault();

    if(transactionName.value.trim() === "" || amount.value.trim() === "") {
        alert("Please enter a valid transactionName and value.");
        return;
    } 
        const newTransaction = {
            id: generateId(),
            text: transactionName.value,
            amount: +amount.value
        };

        transactions.push(newTransaction);

        addTransactionToDOM(newTransaction);
        updateValues();
        updateLocalStorage();

        transactionName.value = "";
        amount.value = "";
}

// Adding transaction to the DOM
function addTransactionToDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    
    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="deleteBtn">Delete</button>
        <button class="editBtn">Edit</button>
    </div>
    `;

    const deleteBtn = item.querySelector(".deleteBtn");
    const editBtn = item.querySelector(".editBtn");
    deleteBtn.addEventListener("click", () => removeTransaction(transaction.id));
    editBtn.addEventListener("click", () => editTransaction(transaction.id));

    list.appendChild(item);
}

// Updates the balance, income, expense
function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0).toFixed(2));
    
    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;
    console.log(amounts);
}

// Removing a transaction
function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

// Editing a transaction
function editTransaction(id) {
    const transactionToEdit = transactions.find(t => t.id == id);
    if(transactionToEdit) {
        transactionName.value = transactionToEdit.text;
        amount.value = Math.abs(transactionToEdit.amount);
        transactions = transactions.filter(t => t.id !== id);
        updateLocalStorage();
        init();
    }
}

// Updating in LocalStorage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Initalizing the app
function init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionToDOM);
    updateValues();
}

init();

function generateId() {
    return Math.floor(Math.random() * 100000000000);
}

form.addEventListener("submit", transaction);
