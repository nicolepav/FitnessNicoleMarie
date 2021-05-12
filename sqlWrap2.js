'use strict'

const sql = require('sqlite3');
const util = require('util');

// old-fashioned database creation code 

// creates a new database object, not a new database. 
const db2 = new sql.Database("profile.db")

// check if ProfileTable database exists
let cmd2 = " SELECT name FROM sqlite_master WHERE type='table' AND name='ProfileTable' ";

db2.get(cmd2, function (err, val) {
  if (val == undefined) {
        console.log("No ProfileTable database file - creating one");
        createProfileTable();
  } else {
        console.log("ProfileTable Database file found");
  }
});

function createProfileTable() {
  const cmd = 'CREATE TABLE ProfileTable (userID TEXT, firstName TEXT)';
  db2.run(cmd, function(err, val) {
    if (err) {
      console.log("ProfileTable Database creation failure",err.message);
    } else {
      console.log("Created ProfileTable database");
    }
  });
}

// wrap all database commands in promises
db2.run = util.promisify(db2.run);
db2.get = util.promisify(db2.get);
db2.all = util.promisify(db2.all);

// empty all data from db
db2.deleteEverything = async function() {
  await db2.run("delete from ProfileTable");
  db2.run("vacuum");
}

// allow code in index.js to use the db object
module.exports = db2;