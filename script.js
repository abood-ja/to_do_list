"use strict";
const numberOfTasks = document.getElementById("statsText");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const stateBtns = document.querySelector(".filters");
const textField = document.getElementById("todoInput");
const allStateBtns = [...document.querySelectorAll(".filter-btn")];
const allTasks = [];
function addNewTask(e) {
  const task = new Task(textField.value);
  allTasks.push(task);
}
function renderTasks(filteredTasksHTML) {
  list.innerHTML = "";
  filteredTasksHTML.forEach(
    (task) => (list.innerHTML += task.createTaskHTML())
  );
}
function changeActiveBtn(e) {
  const target = e.target;
  if (!target.classList.contains("filter-btn")) return;
  allStateBtns.forEach((ele) => {
    ele.classList.remove("active");
  });
  target.classList.add("active");
}
function showList(e) {
  const target = e.target;
  if (!target.classList.contains("filter-btn")) return;
  const type = target.dataset.filter;
  let filteredTasksHTML = [];
  if (type == "all") {
    filteredTasksHTML = allTasks.map((task) => task.createTaskHTML());
    renderTasks(filteredTasksHTML);
  } else if (type == "active") {
    const filteredTasks = allTasks.filter((task) => !task.isChecked());
    filteredTasksHTML = filteredTasks.map((task) => task.createTaskHTML());
    renderTasks(filteredTasksHTML);
  } else {
    const filteredTasks = allTasks.filter((task) => task.isChecked());
    filteredTasksHTML = filteredTasks.map((task) => task.createTaskHTML());
    renderTasks(filteredTasksHTML);
  }
}
class Task {
  #id;
  static #counter = 0;

  checked = false;
  constructor(title) {
    this._title = title;
    this.#id = ++Task.#counter;
  }
  get title() {
    return this._title;
  }
  set title(title) {
    this._title = title;
  }
  get id() {
    return this.#id;
  }
  checkTask() {
    this.checked = true;
  }
  isChecked() {
    return this.checked;
  }
  createTaskHTML() {
    return `
        <li class="todo-item">
          <input type="checkbox" class="checkbox" />
          <span class="todo-text" data-id="${this.id}">${this.title}</span>
          <button class="delete-btn">Delete</button>
        </li>
    `;
  }
}
stateBtns.addEventListener("click", changeActiveBtn);
stateBtns.addEventListener("click", showList);
addBtn.addEventListener("click", addNewTask);
