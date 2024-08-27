let balance = 0;
let income = 0;
let expense = 0;
let transactions = [];

const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');
const expenseDisplay = document.getElementById('expense');
const historyList = document.getElementById('history-list');
const transactionForm = document.getElementById('transaction-form');
const addIncomeButton = document.getElementById('add-income');
const addExpenseButton = document.getElementById('add-expense');
const quickIncomeAmount = document.getElementById('quick-income-amount');
const quickExpenseAmount = document.getElementById('quick-expense-amount');

// Event listeners
transactionForm.addEventListener('submit', addExpense);
addIncomeButton.addEventListener('click', addQuickIncome);

function addExpense(event) {
    event.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount >= 0) {
        alert('Please enter a valid expense amount (negative number)');
        return;
    }

    const transaction = {
        id: generateID(),
        description,
        amount,
        date: new Date().toISOString()
    };

    transactions.push(transaction);
    updateValues(); // Update values and history after adding transaction
    updateHistory();
    transactionForm.reset();
}

function generateID() {
    return Math.floor(Math.random() * 1000000);
}

function updateHistory() {
    historyList.innerHTML = ''; // Clear the list before re-rendering

    transactions.forEach(transaction => {
        const item = document.createElement('li');
        item.innerHTML = `
            ${transaction.description}
            <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button onclick="editTransaction(${transaction.id})">Edit</button>
            <button onclick="deleteTransaction(${transaction.id})">Delete</button>
        `;
        item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
        historyList.appendChild(item);
    });
}

function updateValues() {
    // Calculate income and expense from transactions
    income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    balance = income - expense;

    // Update the displays
    incomeDisplay.innerText = `$${income.toFixed(2)}`;
    expenseDisplay.innerText = `$${expense.toFixed(2)}`;
    balanceDisplay.innerText = `$${balance.toFixed(2)}`;
}

function addQuickIncome() {
    const amount = parseFloat(quickIncomeAmount.value);

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid income amount greater than zero');
        return;
    }

    const transaction = {
        id: generateID(),
        description: 'Quick Income',
        amount,
        date: new Date().toISOString()
    };
    transactions.push(transaction);
    updateValues(); // Update values and history after adding transaction
    updateHistory();
    quickIncomeAmount.value = ''; // Reset the input field
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const newDescription = prompt('Enter new description:', transaction.description);
    const newAmount = parseFloat(prompt('Enter new amount:', transaction.amount));

    if (newDescription && !isNaN(newAmount)) {
        transaction.description = newDescription;
        transaction.amount = newAmount;
        updateValues(); // Update values and history after editing transaction
        updateHistory();
    } else {
        alert('Invalid input');
    }
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateValues(); // Update values and history after deleting transaction
    updateHistory();
}

// Uncomment the following lines to test filter and sort functionalities
// function filterTransactions(type) {
//     const filteredTransactions = transactions.filter(t => (type === 'income' ? t.amount > 0 : t.amount < 0));
//     historyList.innerHTML = '';
//     filteredTransactions.forEach(transaction => {
//         const item = document.createElement('li');
//         item.innerHTML = `
//             ${transaction.description}
//             <span>${transaction.amount < 0 ? '-' : '+'}$${Math.abs(transaction.amount).toFixed(2)}</span>
//             <button onclick="editTransaction(${transaction.id})">Edit</button>
//             <button onclick="deleteTransaction(${transaction.id})">Delete</button>
//         `;
//         item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
//         historyList.appendChild(item);
//     });
// }

// function sortTransactions(by) {
//     transactions.sort((a, b) => {
//         if (by === 'date') {
//             return new Date(b.date) - new Date(a.date);
//         } else if (by === 'amount') {
//             return b.amount - a.amount;
//         }
//     });
//     updateHistory();
// }
