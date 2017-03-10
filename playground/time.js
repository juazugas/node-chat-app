const moment = require('moment');

let date = new Date(0); // Unix Epoch
console.log(date);
// Thu Jan 01 1970 01:00:00 GMT+0100 (CET)
//
console.log(date.toISOString());
// "1970-01-01T00:00:00.000Z"

let mdate = moment();

console.log(mdate);
console.log(mdate.format());
console.log(mdate.format('hh:mm a'));

let createdAt = new Date();
console.log(moment(createdAt).startOf('day').fromNow());

