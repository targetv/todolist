let state = {
  todos: [],
  completedtodos: [],
};

function createElm(tag, attobj) {
  const elm = document.createElement(tag);
  for (const key of Object.keys(attobj)) {
    elm[key] = attobj[key];
  }
  return elm;
}

// Create indindividual cards
// Input: todo data
function todoCard(todo) {
  const liEl = document.createElement("li");
  const todoEl = createElm("p", {
    className: "todoBox boxSizing",
    innerText: `${todo.todoText}`,
  });
  if (state.completedtodos.find((todoId) => todoId.id === todo.id)) {
    todoEl.classList.add("underline");
  }

  const todoBtnDel = createElm("button", {
    className: "redButton btn",
    id: "deleteBtn",
    innerText: "-",
  });
  const completedBtn = createElm("button", {
    className: "btn redButton",
    id: "completedBtn",
    innerText: "tick",
  });
  completedBtn.addEventListener("click", function () {
    const todoId = {
      id: todo.id,
    };
    state.completedtodos.push(todoId);
    console.log("added to completedtodos", state.completedtodos);

    render();
  });
  //   dateTimeTimer(todo.completiondate);
  todoBtnDel.addEventListener("click", function () {
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "DELETE",
    }).then(function (response) {
      if (response.ok) {
        liEl.remove();
      }
    });
  });
  liEl.append(todoEl, todoBtnDel, completedBtn);
  return liEl;
}

// Input: date time string
// Action: creates timer from date string
// Output: returns string value

function dateTimeTimer(datetimeString) {
  let countdowntimer = new Date(datetimeString).getTime();

  // Update the count down every 1 second
  setInterval(function () {
    // Get today's date and time
    let currentTimeDate = new Date().getTime();

    let distance = countdowntimer - currentTimeDate;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

    // Output the result in an element with id="demo"
    const liEl = document.getElementById("timer");
    const timerEL = createElm("p", {
      innerText: `${days} d ${hours} hours ${minutes} m `,
    });
    liEl.append(timerEL);
  });
}

// Action: Create todo li element
// Output: todo element

// Loop through state todos and create cards
// Input : Nothing
// Action: Add multiple todos to main element
// Output:  underfined
function userTodos() {
  const sectionEl = document.querySelector("section");
  const ulEl = createElm("ul", { className: "todos" });
  let userTodos = state.todos;
  for (const todo of userTodos) {
    const todoEl = todoCard(todo);
    ulEl.append(todoEl);
  }

  sectionEl.append(ulEl);
}

// Get users submit from forms
// Input: Nothing
// Action: Add user input to state
// Output: Nothing
function userTodosForm() {
  const formEL = document.querySelector("form");
  console.log(formEL);
  formEL.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(formEL.addtodo);
    const todoData = {
      todoText: formEL.addtodo.value,
      completiondate: formEL.finishdate.value,
    };
    addTodoToSever(todoData);
    const section = document.querySelector("section");
    section.innerHTML = "";
    addUserDataToState();
    formEL.reset();
  });
}
// Json Sever Fetch request
// Input: Nothing
// Action: fetch user todos
// Output: Nothing

function getUserDataFromSever() {
  return fetch("http://localhost:3000/todos/").then(function (response) {
    console.log(response);
    return response.json();
  });
}

function addTodoToSever(newTodoObj) {
  fetch("http://localhost:3000/todos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodoObj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success", data);
    });
}

function addUserDataToState() {
  getUserDataFromSever().then(function (todosData) {
    state.todos = todosData;
    render();
  });
}

// Create render function to re render todo
// Input: Nothing
// Action: render todos list
// Output nothing
function render() {
  const sectionEl = document.querySelector("section");
  sectionEl.innerHTML = "";
  userTodos();
}
function init() {
  userTodosForm();
  getUserDataFromSever();
  addUserDataToState();
}

init();
