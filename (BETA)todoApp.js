//@ts-check
("use strict");

const prompt = require(`prompt-sync`)();
const fs = require(`fs`); //will add file-reading and writting

function TodoApp() {
  this.taskId = 0;
  this.allTasks = [];
  this.taskCount = function taskCount() {
    const totalTasks = this.allTasks.length;
    if (totalTasks !== 0) {
      showSuccessMessage();
      return this.allTasks.length;
    }
    throw `No Tasks Found!`;
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
  this.appendTaskToFile();
  showSuccessMessage();
  console.log(`Task ID: ${ids} \n`);
};

TodoApp.prototype.getTaskInfoById = function getTaskInfoById(taskId) {
  const taskIdInt = parseInt(taskId);
  const found = this.allTasks.find(function findTask(obj) {
    const toObj = Object(obj);
    return toObj[`id`] === taskIdInt;
  });
  if (!found) {
    throw `Task ID not Found`;
  }
  showSuccessMessage();
  let taskInfo =
    `Title: ` +
    found[`title`] +
    ` with Due Date: ` +
    found[`dueDate`] +
    ` and finished status: ` +
    found[`finished`] +
    `\n`;
  return taskInfo;
};

TodoApp.prototype.changeTaskDueDate = function changeTaskDueDate(
  taskId,
  newTaskDueDate,
) {
  const taskIdInt = parseInt(taskId);
  const found = this.allTasks.find(function findTask(obj) {
    const toObj = Object(obj);
    return toObj[`id`] === taskIdInt;
  });
  if (!found) {
    throw `Task ID not Found`;
  }
  found[`dueDate`] = newTaskDueDate;
  this.appendTaskToFile();
  showSuccessMessage();
};

TodoApp.prototype.changeTaskStatus = function changeTaskStatus(taskId) {
  const taskIdInt = parseInt(taskId);
  const found = this.allTasks.find(function findTask(obj) {
    const toObj = Object(obj);
    return toObj[`id`] === taskIdInt;
  });
  if (!found) {
    throw `Task ID not Found`;
  }
  found[`finished`] = !!(found[`finished`] ^ 1); //XOR gate alternative (better performance)
  this.appendTaskToFile();
  showSuccessMessage();
};

TodoApp.prototype.removeTaskbyID = function removeTaskbyID(taskId) {
  let currentTaskIndex = -1;
  const taskIdInt = parseInt(taskId);
  const found = this.allTasks.find(function findTask(obj) {
    currentTaskIndex = currentTaskIndex + 1;
    const toObj = Object(obj);
    return toObj[`id`] === taskIdInt;
  });
  if (!found) {
    throw `Task ID not Found`;
  }
  this.allTasks.splice(currentTaskIndex, 1);
  this.appendTaskToFile();
  showSuccessMessage();
};

TodoApp.prototype.removeAllTasks = function removeAllTasks() {
  this.deleteTasksFile();
  this.allTasks.length = 0;
  showSuccessMessage();
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

TodoApp.prototype.appendTaskToFile = function appendTaskToFile() {
  try {
    fs.writeFileSync(`userTasks.json`, JSON.stringify(this.allTasks), `utf-8`);
  } catch (err) {
    fs.appendFileSync(`userTasks.json`, JSON.stringify(this.allTasks), `utf-8`);
  }
  this.allTasks.length = 0;
  this.readTasksFromFile();
};

TodoApp.prototype.readTasksFromFile = function readTasksFromFile() {
  try {
    const userData = fs.readFileSync(`userTasks.json`, `utf-8`);
    const userDataObj = JSON.parse(userData);
    for (let i of userDataObj) {
      this.allTasks.push(i);
    }
  } catch (err) {
    fs.appendFileSync(`userTasks.json`, ``, `utf-8`);
  }
};

TodoApp.prototype.deleteTasksFile = function deleteTasksFile() {
  try {
    fs.unlinkSync(`userTasks.json`);
  } catch (err) {
    throw `The file with the Tasks does not Exist!`;
  }
};

/*Functions that are outside of the class*/
function showSuccessMessage() {
  const blue = "\x1b[34m";
  const defaultCmdColor = "\x1b[0m";
  console.log(`\n` + blue + "Operation was Successful!\n" + defaultCmdColor);
}

function showMainMenu() {
  console.log(`\n1. Open Task Operations Menu`);
  console.log(`2. Exit\n`);
}

function showTaskMenu() {
  console.log(`\n1. Add a new Task`);
  console.log(`2. Get a Task's Info (Title, DueDate, Status)`);
  console.log(`3. Get the info of all the Tasks for this window`);
  console.log(`4. Update Task`);
  console.log(`5. Delete a Task`);
  console.log(`6. Delete all Tasks`);
  console.log(`7. Get the Number of Tasks`);
  console.log(`8. Exit back to Main Menu\n`);
}

function showTaskUpdateOptions() {
  console.log(`\n1. Change a Task's due date`);
  console.log(`2. Toggle a Task's status [finished/unfinished]`);
  console.log(`3. Exit back to Task Operations Menu\n`);
}

function getUserMainMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
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
      userInput.match(/^[1-8]$/) !== null ? true : console.log(`Invalid Input`);
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
      const taskDueDate = validateUserInputForDate();
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
  console.log(`\n`);
  switch (userChoiceOfFunction) {
    case `1`:
      const taskTitle = prompt(`Please add the Title of the task `);
      const taskDueDate = validateUserInputForDate();
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
      break;
    case `7`:
      const numberOfTasks = win1.taskCount();
      numberOfTasks !== 1
        ? console.log(`\nThere are ${numberOfTasks} Tasks in total\n`)
        : console.log(`\nThere is only 1 Task!\n`);
      break;
    case `8`:
      return;
  }
}

function validateUserInputForDate() {
  let taskDueDate;
  let isValidInput = false;
  let isValidDate = false;
  do {
    taskDueDate = readUserDate();
    isValidInput =
      taskDueDate.match(
        /^[0-3]((?<=[3])[0,1]|(?<![3|0])[0-9]|(?<=[0])[1-9])[/|-| ][0,1]((?<=[0])[1-9]|(?<=[1])[0-2])[/|-| ][2][0][2-9]((?<=[2])[5-9]|(?<![2])[0-9])$/g,
      ) !== null
        ? (isValidDate = validateUserDate(taskDueDate))
        : console.log(`Invalid Date Format!`);
  } while (!isValidInput || !isValidDate);
  return taskDueDate;
}

function validateUserDate(taskDueDate) {
  const [userDayToInt, userMonthToInt, userYearToInt] =
    breakUserDateByParts(taskDueDate);
  const userDateObj = new Date(userYearToInt, userMonthToInt, userDayToInt);
  const dateIsValid =
    userDateObj.getDate() === userDayToInt &&
    userDateObj.getMonth() === userMonthToInt;
  const todayDateObj = new Date(); //Get Current Date
  const dateIsInTheFuture = todayDateObj < userDateObj && dateIsValid;
  if (dateIsInTheFuture) {
    return true;
  }
  console.log(`\nThe Due Date cannot be in the past or the present`);
  return false;
}

function breakUserDateByParts(taskDueDate) {
  const userDateByParts = [];
  userDateByParts.push(taskDueDate.slice(0, 2));
  userDateByParts.push(taskDueDate.slice(3, 5));
  userDateByParts.push(taskDueDate.slice(6, 10));
  const userDayToInt = parseInt(userDateByParts[0]);
  const userMonthToInt = parseInt(userDateByParts[1]) - 1; //Needs to be -1 because the getDate Method returns a day before the one the user wants
  const userYearToInt = parseInt(userDateByParts[2]);
  return [userDayToInt, userMonthToInt, userYearToInt]; //Sorry if it's a bit bakaliko
}

function readUserDate() {
  const taskDueDate = prompt(
    `Please add its due date in Format: Day/Month/Year {ex: 29/07/2026} `,
  );
  return taskDueDate;
}

function selectTaskOperation(win1) {
  let userChoiceOfFunction;
  do {
    showTaskMenu();
    userChoiceOfFunction = getUserTaskMenuChoice();
    performSelectedOperation(userChoiceOfFunction, win1);
  } while (userChoiceOfFunction !== `8`);
}

(function main() {
  let wantsToLeave = false;
  let userChoiceOfFunction;
  let win1 = new TodoApp();
  win1.readTasksFromFile();
  do {
    showMainMenu();
    userChoiceOfFunction = getUserMainMenuChoice();
    switch (userChoiceOfFunction) {
      case `1`:
        selectTaskOperation(win1);
        break;
      case `2`:
        wantsToLeave = true;
    }
  } while (!wantsToLeave);
})();
