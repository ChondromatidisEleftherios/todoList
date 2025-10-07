const ar=[];
let ud=`29/00/2025`;  //Will need to make sure that the month goes -1 of what the user gives with the regex, or will cause errors
ar.push(ud.slice(0,2),ud.slice(3,5),ud.slice(6,10));
console.log(ar);

console.log(ar[0]);
const d = new Date(ar[2],ar[1],ar[0]);
const a = d.getDate() === parseInt(ar[0]); //will compare those two to see if the user has put a day that exists in the month (for example, avoids 31/02).
console.log(a);
console.log(d);
console.log(d.getDate());

// ^[0-3][0-9][/|-| ][0-1][0-9][/|-| ][2][0][2-9][2-9]$ will fix this too (don't allow user to type 19 for example//
