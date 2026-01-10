let toDos = [];

function loadTodos() {
    try{    //load the todos, if fails, set to blank
        const stored = localStorage.getItem("toDos");   
        toDos = stored ? JSON.parse(stored) : [];
    } catch {
        toDos = [];
    }
}

function saveTodos() {
    localStorage.setItem("toDos", JSON.stringify(toDos)); //save todos to storage
}

function getText() {
    return document.getElementById("todo-input").value; //get the value typed in the form input
}

function renderTodo(todo) {
    const list = document.getElementById("todo-list");
    const item = document.createElement("li");
    item.dataset.id = String(todo.id);
    if (todo.done) {item.classList.add("done")}

    const delbut = document.createElement("button"); //create a delete button for each list item
    delbut.classList.add("delete");
    delbut.textContent = "Delete";

    const donebut = document.createElement("button") //create a finished button for each list item
    donebut.classList.add("finished");
    donebut.textContent = todo.done ? "Unfinished" : "Finished";

    item.append(donebut, "     ", todo.text, "     ", delbut); 
    list.append(item); //append items to the unordered list (ul)
}

function rendarAll() {
    const list = document.getElementById("todo-list");
    list.textContent = "";
    toDos.forEach(renderTodo);
}

function addText(){
    const text = getText().trim(); //get text and remove whitespace
    if (!text) return; 

    const id = Date.now(); //set random id (date works fine)

    const todo = { id, text, done: false }; //make object
    toDos.push(todo);
    saveTodos();
    renderTodo(todo);
    
}

document.addEventListener("DOMContentLoaded", () => {
    loadTodos();
    rendarAll();
})

document.querySelector("form").addEventListener("submit", (doc) => {doc.preventDefault(); //listen for when the add or submit button is pressed
    addText()
    document.getElementById("todo-input").value = ""; //once clicked, add the text to list and set input back to blank
    })

document.getElementById("todo-list").addEventListener("click", (event) =>  { //listen for when the delete or finished button is pressed
    if (event.target.tagName !== "BUTTON") return;

    const li = event.target.parentElement;
    const id = li.dataset.id;

    if (event.target.classList.contains("delete")) { //once clicked, check if its delete button then remove the item on the list
        li.remove()
        toDos = toDos.filter(t => String(t.id) !== id);
        saveTodos();
    } 
    else if (event.target.classList.contains("finished")) { //once clicked, check if its finished button then change the state of the button
            const isDone = li.classList.toggle("done");
            event.target.textContent = isDone ? "Unfinished" : "Finished"
            const idx = toDos.findIndex(t => String(t.id) === id);
            if (idx !== -1) {
                toDos[idx].done = isDone;
                saveTodos();
            }}})