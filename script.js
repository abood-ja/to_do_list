"use strict";
class Task {
  #id;

  constructor(title, expectedTime, urgetOrNot) {
    this.title = title;
    this.expectedTime = expectedTime;
    this.urgetOrNot = urgetOrNot;
  }
}
