let toDos = []; //store todos in memory
let currentFilter = "all"; //default filter

function loadTodos() {
    try{    //load the todos, if fails, set to blank
        const stored = localStorage.getItem("toDos");   
        toDos = stored ? JSON.parse(stored) : []; //parse json into an array, fall back to [] on an error
    } catch {
        toDos = [];
    }
}

function saveTodos() {
    localStorage.setItem("toDos", JSON.stringify(toDos)); //save todos to storage and convert array back to json
}

function getText() {
    return document.getElementById("todo-input").value; //get the value typed in the form input
}

function renderTodo(todo) { //render one todo into the list
    const list = document.getElementById("todo-list");
    const item = document.createElement("li");
    item.dataset.id = String(todo.id);

    if (todo.done) {item.classList.add("done")}

    const delbut = document.createElement("button"); //create a delete button for each list item
    delbut.classList.add("delete");
    delbut.textContent = "x";
    delbut.setAttribute("aria-label", "Delete task");

    const donebut = document.createElement("button") //create a finished button for each list item
    donebut.classList.add("finished");
    donebut.textContent = todo.done ? "Unfinished" : "Finished";

    const textSpan = document.createElement("span"); //create a span with a class to append elements without manual spaces
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;

    item.append(donebut, textSpan, delbut); 
    list.append(item); //append items to the unordered list (ul)
}

function renderAll() { //render the full list
    const list = document.getElementById("todo-list");
    list.innerHTML = ""; //clear existing items from ui
    
    let visibleTodos; //decide which todos to show based on the filter
    if (currentFilter === "all") {
        visibleTodos = toDos;
    } else if (currentFilter === "active") {
        visibleTodos = toDos.filter(t => !t.done);
    } else if (currentFilter === "completed") {
        visibleTodos = toDos.filter(t => t.done);
    }
    
    visibleTodos.forEach(renderTodo); //render each visible todo
    updateClearButton(); //update status of clear button
    
    const activeCount = toDos.filter(t => !t.done).length; //update the items left counter
    document.getElementById("item-count").textContent = `${activeCount} left`;
    
    const emptyState = document.getElementById("empty-state"); //show empty state when there are no todos
    if (toDos.length === 0) {
        emptyState.style.display = "flex";
        list.style.display = "none";
    } else {
        emptyState.style.display = "none";
        list.style.display = "block";
    }
}

function addText(){ //add new todo from user input
    const text = getText().trim(); //get text and remove whitespace
    if (!text) return; 

    const id = Date.now() + Math.floor(Math.random() * 1000); //generate unique id with random suffix

    const todo = { id, text, done: false }; //make object
    toDos.push(todo);
    saveTodos();
    renderAll() ;
    
}

function updateClearButton() { //enable or disable the clear completed button
    const button = document.getElementById("clear-completed");
    const hasCompleted = toDos.some(t => t.done); //check if any todo is done

    button.disabled = !hasCompleted; //disable button if there is no completed todos
}

document.addEventListener("DOMContentLoaded", () => { //load saved data and render once after the DOM exists
    loadTodos();
    renderAll();
    document.querySelector('.filters button[data-filter="all"]').classList.add('active-filter');
})

document.querySelector("form").addEventListener("submit", (doc) => {doc.preventDefault(); //listen for when the add or submit button is pressed
    addText()
    document.getElementById("todo-input").value = ""; //once clicked, add the text to list and set input back to blank
    })

document.getElementById("todo-list").addEventListener("click", (event) =>  { //listen for when the delete or finished button is pressed
    if (event.target.tagName !== "BUTTON") return;

    const li = event.target.parentElement;
    const id = li.dataset.id;

    if (event.target.classList.contains("delete")) { //update array, save, then re-render
        toDos = toDos.filter(t => String(t.id) !== id);
        saveTodos();
        renderAll();
    } 
    else if (event.target.classList.contains("finished")) { //toggle done class on li, mirror button label, update array, then save
            const isDone = li.classList.toggle("done");
            event.target.textContent = isDone ? "Unfinished" : "Finished"
            const idx = toDos.findIndex(t => String(t.id) === id); 
            if (idx !== -1) {
                toDos[idx].done = isDone;
                saveTodos();
                renderAll();
}}})

document.querySelector(".filters").addEventListener("click", (event) => { //set current filter, re-render, and highlight the active filter button
    if (event.target.tagName !== "BUTTON") return;
    
    currentFilter = event.target.dataset.filter;
    renderAll();
    
    document.querySelectorAll(".filters button").forEach(btn => 
        btn.classList.remove("active-filter")
    );
    event.target.classList.add("active-filter");
});

document.getElementById("clear-completed").addEventListener("click", () => { //keep only not completed todos, then save and re-render
    toDos = toDos.filter(t => !t.done); 
    saveTodos();
    renderAll();  
})