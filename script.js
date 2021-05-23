let state = {
  todos: [],
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
    innerText: `${todo.todoText} \n ${todo.completiondate}`,
  });
  const todoBtnDel = createElm("button", {
    className: "redButton btn",
    id: "deleteBtn",
    innerText: "-",
  });
  todoBtnDel.addEventListener("click", function () {
    fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "DELETE",
    }).then(function (response) {
      if (response.ok) {
        liEl.remove();
      }
    });
  });
  liEl.append(todoEl, todoBtnDel);
  return liEl;
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
  userTodos();
}
function init() {
  userTodosForm();
  getUserDataFromSever();
  addUserDataToState();
}

init();
