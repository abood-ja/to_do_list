"use strict";

const numberOfTasks = document.getElementById("statsText");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
const stateBtns = document.querySelector(".filters");
const textField = document.getElementById("todoInput");
const btnAll = document.querySelector('[data-filter="all"]'); // the btn that show all tasks
const allStatesBtns = [...document.querySelectorAll(".filter-btn")]; // all the btns that decide the type of tasks showing
let allTasks = [];
function addNewTask() {
  if (textField.value === "") return;
  const task = new Task(textField.value);
  textField.value = "";
  allTasks.push(task);
  allStatesBtns.forEach((ele) => {
    ele.classList.remove("active");
  });
  btnAll.classList.add("active");
  storeTasksInLocaleStorage();
  renderTasks(allTasks.map((task) => task.createTaskHTML()));
  udateRemainingTasks();
}
function calcRemainingTasks() {
  return allTasks.filter((task) => !task.isChecked()).length;
}
function udateRemainingTasks() {
  numberOfTasks.textContent = `${calcRemainingTasks()} tasks remaining`;
}
function addNewTaskWithEnter(e) {
  if (textField.value === "") return;
  if (e.key === "Enter") {
    addNewTask();
  }
}
function deleteTask(e) {
  const target = e.target;
  if (!target.classList.contains("delete-btn")) return;
  const activeBtn = document.querySelector(".filter-btn.active");
  const task = target.closest(".todo-item");
  const id = task.dataset.id;
  const index = allTasks.findIndex((task) => task.id == id);
  allTasks.splice(index, 1);
  storeTasksInLocaleStorage();
  renderTasks(getTasksHTMLByType(activeBtn.dataset.filter));
  udateRemainingTasks();
}
function checkUncheckTask(e) {
  const target = e.target;
  if (!target.classList.contains("checkbox")) return;
  const activeBtn = document.querySelector(".filter-btn.active");
  const clickedTask = target.closest(".todo-item");
  const id = clickedTask.dataset.id;
  if (target.checked) {
    const task = allTasks.find((task) => task.id == id);
    task.checkTask();
    storeTasksInLocaleStorage();
    renderTasks(getTasksHTMLByType(activeBtn.dataset.filter));
    udateRemainingTasks();
  } else if (!target.checked) {
    const task = allTasks.find((task) => task.id == id);
    task.unCheckTask();
    storeTasksInLocaleStorage();

    renderTasks(getTasksHTMLByType(activeBtn.dataset.filter));
    udateRemainingTasks();
  }
}
function storeTasksInLocaleStorage() {
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}
function loadTasksFromLocaleStorage() {
  const saved = JSON.parse(localStorage.getItem("tasks")) || [];
  allTasks = saved.map((obj) => {
    const task = new Task(obj._title);
    task.checked = obj.checked;
    task.changeId(obj.id);
    return task;
  });

  if (allTasks.length > 0) {
    renderTasks(allTasks.map((task) => task.createTaskHTML()));
  }
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
  unCheckTask() {
    this.checked = false;
  }
  isChecked() {
    return this.checked;
  }
  createTaskHTML() {
    return `
        <li class="todo-item" data-id="${this.id}">
          <input type="checkbox" class="checkbox"   ${
            this.checked ? "checked" : ""
          }/>
          <span class="todo-text" >${this.title}</span>
          <button class="delete-btn">Delete</button>
        </li>
    `;
  }
  changeId(id) {
    this.#id = id;
  }
}
list.addEventListener("click", deleteTask);
list.addEventListener("change", checkUncheckTask);
stateBtns.addEventListener("click", changeActiveBtn);
stateBtns.addEventListener("click", showList);
addBtn.addEventListener("click", addNewTask);
textField.addEventListener("keydown", addNewTaskWithEnter);
loadTasksFromLocaleStorage();
