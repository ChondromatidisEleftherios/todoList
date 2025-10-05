//@ts-check
("use strict");

const prompt = require("prompt-sync")(); 

function TodoApp() {
  this.taskId = 0;
  this.allTasks = [];
  this.taskCount = function taskCount() {
    return this.allTasks.length;
  };
}

TodoApp.prototype.addTask = function addTask(taskTitle, taskDueDate) {
  const ids = (this.taskId = this.taskId + 1);
  const taskObj = {
    id: ids,
    title: taskTitle,
    dueDate: taskDueDate,
    finished: false,
  };
  this.allTasks.push(taskObj);
  showSuccessMessage();
  console.log(`Task ID: ${ids} \n`);
};

TodoApp.prototype.getTaskInfoById = function getTaskInfoById(taskId) {
  for (let obj of this.allTasks) {
    const toObj = Object(obj);
    const taskIdInt = parseInt(taskId);
    if (toObj["id"] === taskIdInt) {
      showSuccessMessage();
      let taskInfo =
        "Title: " +
        toObj["title"] +
        " with Due Date: " +
        toObj["dueDate"] +
        " and finished status: " +
        toObj["finished"] +
        "\n";
      return taskInfo;
    }
  }
  throw `Task ID not found!`;
};

TodoApp.prototype.changeTaskDueDate = function changeTaskDueDate(
  taskId,
  newTaskDueDate,
) {
  /*for (let obj of this.allTasks) {
    const toObj = Object(obj);
    const taskIdInt = parseInt(taskId);
    if (toObj["id"] === taskIdInt) {
      toObj["dueDate"] = newTaskDueDate;
      break;
    }
  }*/
  const found = this.allTasks.find(function findTask(obj) {
    const toObj = Object(obj);
    const taskIdInt = parseInt(taskId);
    return toObj["id"] === taskIdInt;
  });
  showSuccessMessage();
  found["dueDate"] = newTaskDueDate;
};

TodoApp.prototype.changeTaskStatus = function changeTaskStatus(taskId) {
  for (let obj of this.allTasks) {
    const toObj = Object(obj);
    const taskIdInt = parseInt(taskId);
    if (toObj["id"] === taskIdInt) {
      /*if (!toObj["finished"]) {
        toObj["finished"] = true;
      } else {
        toObj["finished"] = false;
      }*/
      showSuccessMessage();
      toObj["finished"] = !!(toObj["finished"] ^ 1); //XOR gate alternative (better performance)
      break;
    }
  }
};

TodoApp.prototype.removeTaskbyID = function removeTaskbyID(taskId) {
  let currentTaskIndex = 0;
  for (let obj of this.allTasks) {
    const toObj = Object(obj);
    const taskIdInt = parseInt(taskId);
    if (toObj["id"] === taskIdInt) {
      showSuccessMessage();
      this.allTasks.splice(currentTaskIndex, 1);
      return;
    }
    currentTaskIndex = currentTaskIndex + 1;
  }
  throw "Task ID not found!";
};

TodoApp.prototype.removeAllTasks = function removeAllTasks() {
  showSuccessMessage();
  this.allTasks.length = 0;
};

TodoApp.prototype.getAllTasks = function getAllTasks() {
  const taskListIsEmpty = this.allTasks.length === 0;
  if (!taskListIsEmpty) {
    const taskStr = JSON.stringify(this.allTasks);
    showSuccessMessage();
    return taskStr;
  }
  return `\nNo Tasks Found\n`;
};

/*Main function*/
function showSuccessMessage() {
  const blue = "\x1b[34m";
  const defaultCmdColor = "\x1b[0m";
  console.log(`\n` + blue + "Operation was Successful!\n" + defaultCmdColor);
}

function showMainMenu() {
  console.log(`1. Open Task Operations Menu`);
  console.log(`2. Exit\n`);
}

function showTaskMenu() {
  console.log(`1. Add a new Task`);
  console.log(`2. Get a Task's Info (Title, DueDate, Status)`);
  console.log(`3. Get the info of all the Tasks for this window`);
  console.log(`4. Update Task`);
  console.log(`5. Delete a Task`);
  console.log(`6. Delete all Tasks`);
  console.log(`7. Exit back to Main Menu\n`);
}

function showTaskUpdateOptions() {
  console.log(`1. Change a Task's due date`);
  console.log(`2. Toggle a Task's status [finished/unfinished]`);
  console.log(`3. Exit back to Task Operations Menu\n`);
}

function getUserMainMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt("");
    isValidInput =
      userInput.match(/^[1-2]$/) !== null ? true : console.log(`Invalid Input`);
  } while (!isValidInput);
  return userInput;
}

function getUserTaskMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput =
      userInput.match(/^[1-7]$/) !== null ? true : console.log(`Invalid Input`);
  } while (!isValidInput);
  return userInput;
}

function getUserTaskUpdateMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput =
      userInput.match(/^[1-3]$/) !== null ? true : console.log(`Invalid Input`);
  } while (!isValidInput);
  return userInput;
}

function performSelectedUpdateOperation(userChoiceOfUpdateFunction, win1) {
  let taskId;
  switch (userChoiceOfUpdateFunction) {
    case `1`:
      taskId = prompt(`Give the task ID `);
      const taskDueDate = validateUserDate();
      win1.changeTaskDueDate(taskId, taskDueDate);
      break;
    case `2`:
      taskId = prompt(`Give the task ID `);
      win1.changeTaskStatus(taskId);
      break;
    case `3`:
      return;
  }
}

function performSelectedOperation(userChoiceOfFunction, win1) {
  let taskId;
  let userChoiceOfUpdateFunction;
  let exitChoiceNumber = `3`;
  switch (userChoiceOfFunction) {
    case `1`:
      const taskTitle = prompt(`Please add the Title of the task `);
      const taskDueDate = validateUserDate();
      win1.addTask(taskTitle, taskDueDate);
      break;
    case `2`:
      taskId = prompt(`Give the task ID `);
      const taskInfo = win1.getTaskInfoById(taskId);
      console.log(`\nTask with Id ${taskId} has ${taskInfo}`);
      break;
    case `3`:
      const everyTaskInfo = win1.getAllTasks();
      console.log(everyTaskInfo);
      break;
    case `4`:
      do {
        showTaskUpdateOptions();
        userChoiceOfUpdateFunction = getUserTaskUpdateMenuChoice();
        performSelectedUpdateOperation(userChoiceOfUpdateFunction, win1);
      } while (userChoiceOfUpdateFunction !== exitChoiceNumber);
      break;
    case `5`:
      taskId = prompt(`Give the task ID `);
      win1.removeTaskbyID(taskId);
      break;
    case `6`:
      win1.removeAllTasks();
    case `7`:
      return;
  }
}

function validateUserDate() {
  /*NEEDS FIXING*/
  let taskDueDate;
  let isValidDate = false;
  do {
    taskDueDate = readUserDate();
    const secondLastCharacterOfDate = taskDueDate.slice(-2, -1);
    const lastCharacterOfDate = taskDueDate.slice(-1);
    const intLastCharacterOfDate = parseInt(lastCharacterOfDate);
    isValidDate =
      taskDueDate.match(
        /^[1-9][0-9]?[-|/| ][1-9][0-2]?[-|/| ][2][0][2-9][0-9]$/,
      ) !== null &&
      (secondLastCharacterOfDate !== `2` || intLastCharacterOfDate > 5)
        ? true
        : console.log(`Invalid Input`);
  } while (!isValidDate);
  return taskDueDate;
}

function readUserDate() {
  const taskDueDate = prompt(`Please add its due date `);
  return taskDueDate;
}

(function main() {
  let wantsToLeave = false;
  let userChoiceOfFunction;
  let win1 = new TodoApp();
  do {
    showMainMenu();
    userChoiceOfFunction = getUserMainMenuChoice();
    switch (userChoiceOfFunction) {
      case `1`:
        do {
          showTaskMenu();
          userChoiceOfFunction = getUserTaskMenuChoice();
          performSelectedOperation(userChoiceOfFunction, win1);
        } while (userChoiceOfFunction !== `7`);
        break;
      case `2`:
        wantsToLeave = true;
    }
  } while (!wantsToLeave);
})();
