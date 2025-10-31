//@ts-check
("use strict");

import * as fs from "fs";
import promptSync from "prompt-sync";

const prompt = promptSync();

import * as todoAppUtils from "./todoAppUtils.js";


function TodoApp(workSpaceName) {
  this.workSpaceName = workSpaceName;
  this.taskId = 0;
  this.allTasks = [];
  this.readTasksFromFile();
  this.taskCount = function taskCount() {
    const totalTasks = this.allTasks.length;
    if (totalTasks !== 0) {
      todoAppUtils.showSuccessMessage();
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
  todoAppUtils.showSuccessMessage();
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
  todoAppUtils.showSuccessMessage();
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
  todoAppUtils.showSuccessMessage();
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
  todoAppUtils.showSuccessMessage();
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
  todoAppUtils.showSuccessMessage();
};

TodoApp.prototype.removeAllTasks = function removeAllTasks() {
  this.deleteTasksFile();
  this.deleteTheLastTaskId();
  this.allTasks.length = 0;
  todoAppUtils.showSuccessMessage();
};

TodoApp.prototype.getAllTasks = function getAllTasks() {
  const taskListIsEmpty = this.allTasks.length === 0;
  if (!taskListIsEmpty) {
    const taskStr = JSON.stringify(this.allTasks);
    todoAppUtils.showSuccessMessage();
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


export { TodoApp };
