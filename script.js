"use strict";
const numberOfTasks = document.getElementById("statsText");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("todoList");
class Task {
  #id;
  checked = false;
  constructor(title) {
    this._title = title;
  }
  get title() {
    return this._title;
  }
  set title(title) {
    this._title = title;
  }
  checkTask() {
    this.checked = true;
  }
  isChecked() {
    return this.checked;
  }
}
