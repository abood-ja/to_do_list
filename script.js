"use strict";

const numberOfTasks = document.getElementById("statsText");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const stateBtns = document.querySelector(".filters");
const textField = document.getElementById("todoInput");
const btnAll = document.querySelector('[data-filter="all"]'); // the btn that show all tasks
const allStatesBtns = [...document.querySelectorAll(".filter-btn")]; // all the btns that decide the type of tasks showing
const allTasks = [];
function addNewTask(e) {
  const task = new Task(textField.value);
  textField.value = "";
  allTasks.push(task);
  allStatesBtns.forEach((ele) => {
    ele.classList.remove("active");
  });
  btnAll.classList.add("active");
  renderTasks(allTasks.map((task) => task.createTaskHTML()));
}
function deleteTask(e) {
  const target = e.target;
  if (!target.classList.contains("delete-btn")) return;
  const activeBtn = document.querySelector(".filter-btn.active");
  const task = target.closest(".todo-item");
  const id = task.dataset.id;
  const index = allTasks.findIndex((task) => task.id == id);
  allTasks.splice(index, 1);
  renderTasks(getTasksHTMLByType(activeBtn.dataset.filter));
}
function getTasksHTMLByType(type) {
  const tasks = [];
  if (type == "all") {
    allTasks.forEach((task) => tasks.push(task.createTaskHTML()));
  } else if (type == "active") {
    allTasks.forEach((task) => {
      if (!task.isChecked()) tasks.push(task.createTaskHTML());
    });
  } else {
    allTasks.forEach((task) => {
      if (task.isChecked()) tasks.push(task.createTaskHTML());
    });
  }
  return tasks;
}
function renderTasks(filteredTasksHTML) {
  list.innerHTML = "";
  filteredTasksHTML.forEach((task) => (list.innerHTML += task));
}
function changeActiveBtn(e) {
  const target = e.target;
  if (!target.classList.contains("filter-btn")) return;
  allStatesBtns.forEach((ele) => {
    ele.classList.remove("active");
  });
  target.classList.add("active");
}
function showList(e) {
  const target = e.target;
  if (!target.classList.contains("filter-btn")) return;
  const type = target.dataset.filter;
  renderTasks(getTasksHTMLByType(type));
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
list.addEventListener("click", deleteTask);
stateBtns.addEventListener("click", changeActiveBtn);
stateBtns.addEventListener("click", showList);
addBtn.addEventListener("click", addNewTask);
