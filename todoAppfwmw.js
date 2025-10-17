//@ts-check
("use strict");

const prompt = require(`prompt-sync`)();
const fs = require(`fs`);

function TodoApp(workSpaceName) {
  this.workSpaceName = workSpaceName;
  this.taskId = 0;
  this.allTasks = [];
  this.readTasksFromFile();
  this.taskCount = function taskCount() {
    const totalTasks = this.allTasks.length;
    if (totalTasks !== 0) {
      showSuccessMessage();
      return totalTasks;
    }
    console.log(`No Tasks Found!`);
  };
}

TodoApp.prototype.addTask = function addTask(taskTitle, taskDueDate) {
  const lastSavedTaskId = this.getTheLastTaskId();
  const ids = (this.taskId = lastSavedTaskId + 1);
  const taskObj = {
    id: ids,
    title: taskTitle,
    dueDate: taskDueDate,
    finished: false,
  };
  this.allTasks.push(taskObj);
  this.appendTaskToFile();
  this.saveTheLastTaskId();
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
    return `Task ID not Found`;
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
    console.log(`Task ID not Found`);
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
    console.log(`Task ID not Found`);
  }
  this.allTasks.splice(currentTaskIndex, 1);
  this.appendTaskToFile();
  showSuccessMessage();
};

TodoApp.prototype.removeAllTasks = function removeAllTasks() {
  this.deleteTasksFile();
  this.deleteTheLastTaskId();
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
  const workSpaceTasksFileName = this.constructJSONFileName();
  try {
    fs.writeFileSync(
      workSpaceTasksFileName,
      JSON.stringify(this.allTasks),
      `utf-8`,
    );
  } catch (err) {
    fs.appendFileSync(
      workSpaceTasksFileName,
      JSON.stringify(this.allTasks),
      `utf-8`,
    );
  }
  this.readTasksFromFile();
};

TodoApp.prototype.readTasksFromFile = function readTasksFromFile() {
  const workSpaceTasksFileName = this.constructJSONFileName();
  try {
    const userData = fs.readFileSync(workSpaceTasksFileName, `utf-8`);
    const userDataObj = JSON.parse(userData);
    this.allTasks.length = 0;
    for (let i of userDataObj) {
      this.allTasks.push(i);
    }
  } catch (err) {
    fs.appendFileSync(workSpaceTasksFileName, ``, `utf-8`);
  }
};

TodoApp.prototype.deleteTasksFile = function deleteTasksFile() {
  const workSpaceTasksFileName = this.constructJSONFileName();
  try {
    fs.unlinkSync(workSpaceTasksFileName);
  } catch (err) {
    throw `The file with the Tasks does not Exist!`;
  }
};

TodoApp.prototype.saveTheLastTaskId = function saveTheLastTaskId() {
  const worksSpaceLastIdFile = this.constructLastIdFileName();
  const lastTaskId = this.allTasks[this.allTasks.length - 1][`id`];
  try {
    fs.writeFileSync(worksSpaceLastIdFile, lastTaskId.toString(), `utf-8`);
  } catch (err) {
    fs.appendFileSync(worksSpaceLastIdFile, lastTaskId.toString(), `utf-8`);
  }
};

TodoApp.prototype.getTheLastTaskId = function getTheLastTaskId() {
  const workSpaceLastIdFileName = this.constructLastIdFileName();
  try {
    const lastTaskIdStr = fs.readFileSync(workSpaceLastIdFileName, `utf-8`);
    const lastTaskIdInt = parseInt(lastTaskIdStr);
    return lastTaskIdInt;
  } catch (err) {
    fs.appendFileSync(workSpaceLastIdFileName, `0`, `utf-8`);
    return 0;
  }
};

TodoApp.prototype.deleteTheLastTaskId = function deleteTheLastTaskId() {
  const workSpaceLastIdFileName = this.constructLastIdFileName();
  try {
    fs.unlinkSync(workSpaceLastIdFileName);
  } catch (err) {
    throw `No file containing the last Task ID found!`;
  }
};

TodoApp.prototype.constructJSONFileName = function constructJSONFileName() {
  const workSpaceTasksFileName = `userTasks` + this.workSpaceName + `.json`;
  return workSpaceTasksFileName;
};

TodoApp.prototype.constructLastIdFileName = function constructLastIdFileName() {
  const workSpaceLastIdFileName = `lastIdFor` + this.workSpaceName + `.txt`;
  return workSpaceLastIdFileName;
};

/*Functions that are outside of the class*/
function showSuccessMessage() {
  const blue = "\x1b[34m";
  const defaultCmdColor = "\x1b[0m";
  console.log(`\n` + blue + "Operation was Successful!\n" + defaultCmdColor);
}

function readWorkSpacesFile() {
  let workSpaces = [];
  try {
    workSpaces = fs
      .readFileSync("workSpaces.txt", "utf-8")
      .toString()
      .split("\n");
    console.log(`before ${workSpaces}`);
    workSpaces.splice(workSpaces.length - 1, 1);
    console.log(`after ${workSpaces}`);
  } catch (err) {
    fs.appendFileSync(`workSpaces.txt`, ``, `utf-8`);
  }
  return workSpaces;
}

function getUserMainMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput =
      userInput.match(/^[1-4]$/) !== null ? true : console.log(`Invalid Input`);
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

function getUserWorkSpaceChoice(workSpaceArray) {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput = workSpaceArray.includes(userInput.toLowerCase());
  } while (!isValidInput);
  console.log("WorkSpace Found!!!");
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

function showTaskMenu() {
  console.log(`\n1. Add a new Task to this WorkSpace`);
  console.log(`2. Get a Task's Info (Title, DueDate, Status)`);
  console.log(`3. Get the info of all the Tasks for this WorkSpace`);
  console.log(`4. Update Task`);
  console.log(`5. Delete a Task`);
  console.log(`6. Delete all Tasks on this WorkSpace (resets ID's)`);
  console.log(`7. Get the Number of Tasks for this WorkSpace`);
  console.log(`8. Exit back to Main Menu\n`);
}

function showTaskUpdateOptions() {
  console.log(`\n1. Change a Task's due date`);
  console.log(`2. Toggle a Task's status [finished/unfinished]`);
  console.log(`3. Exit back to Task Operations Menu\n`);
}

function showMainMenu() {
  console.log(`\n1. Select a workspace and dive to the Task options menu`);
  console.log(`2. Create a WorkSpace`);
  console.log(`3. Delete a WorkSpace`);
  console.log(`4. Exit\n`);
}

function selectTaskOperation(win1) {
  let userChoiceOfFunction;
  do {
    showTaskMenu();
    userChoiceOfFunction = getUserTaskMenuChoice();
    performSelectedOperation(userChoiceOfFunction, win1);
  } while (userChoiceOfFunction !== `8`);
}

function deleteWorkSpaceFromFile(workSpaceToBeDeleted, workSpaceArray) {
  const indexOfWorkSpaceToBeDeleted =
    workSpaceArray.indexOf(workSpaceToBeDeleted);
  workSpaceArray.splice(indexOfWorkSpaceToBeDeleted, 1);
  fs.writeFileSync(`workSpaces.txt`, ``, `utf-8`);
  for (let workSpace of workSpaceArray) {
    const addNewLine = workSpace + `\n`;
    fs.appendFileSync(`workSpaces.txt`, addNewLine, `utf-8`);
  }
  const tasksFileName = `userTasks` + workSpaceToBeDeleted + `.json`;
  const idFileName = `lastIdFor` + workSpaceToBeDeleted + `.txt`;
  fs.unlinkSync(tasksFileName);
  fs.unlinkSync(idFileName);
  showSuccessMessage();
}

function removeWorkSpace(workSpaceArray) {
  const workSpaceToBeDeleted = selectWorkSpace(workSpaceArray);
  deleteWorkSpaceFromFile(workSpaceToBeDeleted, workSpaceArray);
}

function appendWorkSpaceToFile(workSpaceName) {
  const addNewLine = workSpaceName + `\n`;
  fs.appendFileSync(`workSpaces.txt`, addNewLine, `utf-8`);
  showSuccessMessage();
}

function readWorkSpaceName() {
  let workSpaceName;
  let isValidWorkSpaceName = false;
  console.log(`Give WorkSpace Name!`);
  do {
    workSpaceName = prompt(``);
    isValidWorkSpaceName = workSpaceName.trim() !== ``;
  } while (!isValidWorkSpaceName);
  return workSpaceName;
}

function createWorkSpace(workSpaceArray) {
  let workSpaceName = readWorkSpaceName();
  workSpaceName = workSpaceName.toLowerCase();
  appendWorkSpaceToFile(workSpaceName);
  workSpaceArray.push(workSpaceName);
  showSuccessMessage();
  return workSpaceArray;
}

function showWorkSpaces(workSpaceArray) {
  for (let workSpace of workSpaceArray) {
    console.log(`${workSpace}`);
  }
}

function selectWorkSpace(workSpaceArray) {
  showWorkSpaces(workSpaceArray);
  console.log(`Select a WorkSpace by typing its name!`);
  const selectedWorkSpace = getUserWorkSpaceChoice(workSpaceArray);
  return selectedWorkSpace;
}

(function main() {
  let wantsToLeave = false;
  let userChoiceOfFunction;
  let workSpaceArray = readWorkSpacesFile();
  let win1;
  do {
    showMainMenu();
    userChoiceOfFunction = getUserMainMenuChoice();
    switch (userChoiceOfFunction) {
      case `1`:
        if (workSpaceArray.length !== 0) {
          const selectedWorkSpace = selectWorkSpace(workSpaceArray);
          win1 = new TodoApp(selectedWorkSpace);
          selectTaskOperation(win1);
        } else {
          console.log(`No WorkSpaces found...`);
        }
        break;
      case `2`:
        workSpaceArray = createWorkSpace(workSpaceArray);
        console.log(workSpaceArray);
        break;
      case `3`:
        if (workSpaceArray.length !== 0) {
          removeWorkSpace(workSpaceArray);
        } else {
          console.log(`No WorkSpaces found...`);
        }
        break;
      case `4`:
        wantsToLeave = true;
    }
  } while (!wantsToLeave);
})();
