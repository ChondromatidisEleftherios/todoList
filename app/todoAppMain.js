//@ts-check
("use strict");

import * as fs from "fs";
import promptSync from "prompt-sync";

import * as todoAppUtils from "./todoAppUtils.js";
import * as todoAppClass from "./todoAppClass.js";

(function main() {
  let wantsToLeave = false;
  let userChoiceOfFunction;
  let workSpaceArray = todoAppUtils.readWorkSpacesFile();
  let win1;
  do {
    todoAppUtils.showMainMenu();
    userChoiceOfFunction = todoAppUtils.getUserMainMenuChoice();
    switch (userChoiceOfFunction) {
      case `1`:
        if (workSpaceArray.length !== 0) {
          const selectedWorkSpace = todoAppUtils.selectWorkSpace(workSpaceArray);
          win1 = new todoAppClass.TodoApp(selectedWorkSpace);
          todoAppUtils.selectTaskOperation(win1);
        } else {
          console.log(`No WorkSpaces found...`);
        }
        break;
      case `2`:
        workSpaceArray = todoAppUtils.createWorkSpace(workSpaceArray);
        console.log(workSpaceArray);
        break;
      case `3`:
        if (workSpaceArray.length !== 0) {
          todoAppUtils.removeWorkSpace(workSpaceArray);
        } else {
          console.log(`No WorkSpaces found...`);
        }
        break;
      case `4`:
        wantsToLeave = true;
    }
  } while (!wantsToLeave);
})();
