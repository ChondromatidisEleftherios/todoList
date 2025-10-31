//@ts-check
("use strict");

import * as fs from "fs";
import promptSync from "prompt-sync";

const prompt = promptSync();

export function showSuccessMessage() {
  const blue = "\x1b[34m";
  const defaultCmdColor = "\x1b[0m";
  console.log(`\n` + blue + "Operation was Successful!\n" + defaultCmdColor);
}

export function readWorkSpacesFile() {
  let workSpaces = [];
  try {
    workSpaces = fs
      .readFileSync("workSpaces.txt", "utf-8")
      .toString()
      .split("\n");
    workSpaces.splice(workSpaces.length - 1, 1);
  } catch (err) {
    fs.appendFileSync(`workSpaces.txt`, ``, `utf-8`);
  }
  return workSpaces;
}

export function getUserMainMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput =
      userInput.match(/^[1-4]$/) !== null ? true : console.log(`Invalid Input`);
  } while (!isValidInput);
  return userInput;
}

export function getUserTaskMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput =
      userInput.match(/^[1-8]$/) !== null ? true : console.log(`Invalid Input`);
  } while (!isValidInput);
  return userInput;
}

export function getUserTaskUpdateMenuChoice() {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput =
      userInput.match(/^[1-3]$/) !== null ? true : console.log(`Invalid Input`);
  } while (!isValidInput);
  return userInput;
}

export function getUserWorkSpaceChoice(workSpaceArray) {
  let userInput;
  let isValidInput = false;
  do {
    userInput = prompt(``);
    isValidInput = workSpaceArray.includes(userInput.toLowerCase());
  } while (!isValidInput);
  console.log("WorkSpace Found!!!");
  return userInput;
}

export function performSelectedUpdateOperation(userChoiceOfUpdateFunction, win1) {
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

export function performSelectedOperation(userChoiceOfFunction, win1) {
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

export function validateUserInputForDate() {
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

export function validateUserDate(taskDueDate) {
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

export function breakUserDateByParts(taskDueDate) {
  const userDateByParts = [];
  userDateByParts.push(taskDueDate.slice(0, 2));
  userDateByParts.push(taskDueDate.slice(3, 5));
  userDateByParts.push(taskDueDate.slice(6, 10));
  const userDayToInt = parseInt(userDateByParts[0]);
  const userMonthToInt = parseInt(userDateByParts[1]) - 1; //Needs to be -1 because the getDate Method returns a day before the one the user wants
  const userYearToInt = parseInt(userDateByParts[2]);
  return [userDayToInt, userMonthToInt, userYearToInt]; //Sorry if it's a bit bakaliko
}

export function readUserDate() {
  const taskDueDate = prompt(
    `Please add its due date in Format: Day/Month/Year {ex: 29/07/2026} `,
  );
  return taskDueDate;
}

export function showTaskMenu() {
  console.log(`\n1. Add a new Task to this WorkSpace`);
  console.log(`2. Get a Task's Info (Title, DueDate, Status)`);
  console.log(`3. Get the info of all the Tasks for this WorkSpace`);
  console.log(`4. Update Task`);
  console.log(`5. Delete a Task`);
  console.log(`6. Delete all Tasks on this WorkSpace (resets ID's)`);
  console.log(`7. Get the Number of Tasks for this WorkSpace`);
  console.log(`8. Exit back to Main Menu\n`);
}

export function showTaskUpdateOptions() {
  console.log(`\n1. Change a Task's due date`);
  console.log(`2. Toggle a Task's status [finished/unfinished]`);
  console.log(`3. Exit back to Task Operations Menu\n`);
}

export function showMainMenu() {
  console.log(`\n1. Select a workspace and dive to the Task options menu`);
  console.log(`2. Create a WorkSpace`);
  console.log(`3. Delete a WorkSpace`);
  console.log(`4. Exit\n`);
}

export function selectTaskOperation(win1) {
  let userChoiceOfFunction;
  do {
    showTaskMenu();
    userChoiceOfFunction = getUserTaskMenuChoice();
    performSelectedOperation(userChoiceOfFunction, win1);
  } while (userChoiceOfFunction !== `8`);
}

export function deleteWorkSpaceFromFile(workSpaceToBeDeleted, workSpaceArray) {
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

export function removeWorkSpace(workSpaceArray) {
  const workSpaceToBeDeleted = selectWorkSpace(workSpaceArray);
  deleteWorkSpaceFromFile(workSpaceToBeDeleted, workSpaceArray);
}

export function appendWorkSpaceToFile(workSpaceName) {
  const addNewLine = workSpaceName + `\n`;
  fs.appendFileSync(`workSpaces.txt`, addNewLine, `utf-8`);
  showSuccessMessage();
}

export function readWorkSpaceName() {
  let workSpaceName;
  let isValidWorkSpaceName = false;
  console.log(`Give WorkSpace Name!`);
  do {
    workSpaceName = prompt(``);
    isValidWorkSpaceName = workSpaceName.trim() !== ``;
  } while (!isValidWorkSpaceName);
  return workSpaceName;
}

export function createWorkSpace(workSpaceArray) {
  let workSpaceName = readWorkSpaceName();
  workSpaceName = workSpaceName.toLowerCase();
  appendWorkSpaceToFile(workSpaceName);
  workSpaceArray.push(workSpaceName);
  showSuccessMessage();
  return workSpaceArray;
}

export function showWorkSpaces(workSpaceArray) {
  for (let workSpace of workSpaceArray) {
    console.log(`${workSpace}`);
  }
}

export function selectWorkSpace(workSpaceArray) {
  showWorkSpaces(workSpaceArray);
  console.log(`Select a WorkSpace by typing its name!`);
  const selectedWorkSpace = getUserWorkSpaceChoice(workSpaceArray);
  return selectedWorkSpace;
}
