Object.prototype.toString = function toString() {
  let objectSize = Object.values(this).length;
  let objStr = "";
  if (objectSize === 0) {
    return;
  }
  objStr = objStr + `{`;
  for (let i = 0; i < objectSize; i++) {
    if (objectSize - 1 === i) {
      objStr = objStr + `"${Object.keys(this)[i]}":${Object.values(this)[i]}}`;
      break;
    }
    if (typeof Object.values(this)[i] !== `string`) {
      objStr = objStr + `"${Object.keys(this)[i]}":${Object.values(this)[i]},`;
    } else {
      objStr =
        objStr + `"${Object.keys(this)[i]}":"${Object.values(this)[i]}",`;
    }
  }
  return objStr;
};

const ob = [
  { a: 10, b: 30, c: 50 },
  { a: 20, b: 10 },
  { hi: 100, bye: `hi`, peos: 666 },
];
const ob2 = { hi: 666 };
console.log(`Json Stringify version \n${JSON.stringify(ob)}`);
console.log(`Custom toString property \n${ob.toString()}`);
