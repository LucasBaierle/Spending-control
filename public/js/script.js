const transactionUl = document.querySelector("#transactions")
const incomeDisplay = document.querySelector("#money-plus")
const expenseDisplay = document.querySelector("#money-minus")
const balanceDisplay = document.querySelector("#balance")
const form = document.querySelector("#form")
const inputTransactionName = document.querySelector("#text")
const inputTransactionAmount = document.querySelector("#amount")
const inputSearchTransaction = document.querySelector("#form-search input")

const localStorageTransactions = JSON.parse(localStorage
  .getItem("transactions"));
let transactions = localStorage
  .getItem("transactions") != null ? localStorageTransactions : []

const removeTransaction = (ID) => {
  transactions = transactions.filter(transaction =>
    transaction.id !== ID);

  updateLocalStorage();
  init()
}


const addTransactionIntoDOM = ({ amount, name, id }) => {
  const operator = amount < 0 ? "-" : "+";
  const cssClass = amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement("li");

  li.classList.add(cssClass)
  li.innerHTML = `${name} 
  <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${id})">x</button>`;

  transactionUl.append(li)
}


const getExpense = transactionAmounts =>
  Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);


const getIncome = transactionAmounts =>
  transactionAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);

const getTotal = transactionAmounts =>
  transactionAmounts.
    reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);


const updatedBalanceValues = () => {
  const transactionAmounts = transactions.map(({ amount }) => amount);
  const total = getTotal(transactionAmounts);
  const income = getIncome(transactionAmounts);
  const expense = getExpense(transactionAmounts);

  balanceDisplay.textContent = `R$ ${total}`
  incomeDisplay.textContent = `R$ ${income}`
  expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
  transactionUl.innerHTML = "";
  transactions.forEach(addTransactionIntoDOM);
  updatedBalanceValues()
}
init()

const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

const genereteID = () => { return (Math.round(Math.random() * 10000)) };

const addToTransactionsArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: genereteID(),
    name: transactionName,
    amount: Number(transactionAmount)
  })
}

const clearInputs = () => {
  inputTransactionName.value = "";
  inputTransactionAmount.value = "";
}

const handleEventForm = event => {
  event.preventDefault();

  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName == "" || transactionAmount == "";

  if (isSomeInputEmpty) {
    alert("Por favor, preencha ambos os campos da transação");
    return
  }

  addToTransactionsArray(transactionName, transactionAmount);
  init();
  updateLocalStorage(transactions);
  clearInputs();
}

form.addEventListener("submit", handleEventForm);



const filterTransactions = (transactions, value, returnMatchedTransactions) =>
  transactions.filter(transaction => {
    const matchedTransactions = transaction.textContent.toLowerCase().includes(value);
    return returnMatchedTransactions ? matchedTransactions : !matchedTransactions
  })

const hideTransactions = (transactions, value) => {
  filterTransactions(transactions, value, false)
    .forEach(transaction => transaction.classList.add("hidden"))
}
const showTransactions = (transactions, value) => {
  filterTransactions(transactions, value, true)
    .forEach(transaction => transaction.classList.remove("hidden"));
}


inputSearchTransaction.addEventListener("input", event => {

  const value = event.target.value.trim();
  const transactions = Array.from(transactionUl.children);

  hideTransactions(transactions, value);
  showTransactions(transactions, value);

})
