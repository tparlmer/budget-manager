// create variable to hold db connection
let db;

// establish a connection to IndexedDB database called 'budget_tracker' and set it to version 1
const request = indexedDB.open('budget_tracker', 1);

// event listener will emit database if the version changes
request.onupgradeneeded = function(event) {
    // save reference to db
    const db = event.target.result;
    // create object store called 'budget_input' and set autoIncrement to true
    db.createObjectStore('budget_input', { autoIncrement: true });
};

request.onsuccess = function(event) {
    // when db is successfully created with its object store save reference to db in global variable
    db = event.target.result;
    // check if app is online, if so, run uploadBudget() function to send all local db data to api
    if (navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new budget item and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the database with read and write access
    const transaction = db.transaction(['budget_input'], 'readwrite');
    // access the object store
    const budgetObjectStore = transaction.objectStore('budget_input');
    // add record to object store with add method
    budgetObjectStore.add(record);
}