'use strict'

// database operations.
// Async operations can always fail, so these are all wrapped in try-catch blocks
// so that they will always return something
// that the calling function can use. 

module.exports = {
  // testDB: testDB,
  post_activity: post_activity,
  get_most_recent_planned_activity_in_range: get_most_recent_planned_activity_in_range,
  delete_past_activities_in_range: delete_past_activities_in_range,
  get_most_recent_entry: get_most_recent_entry,
  get_all: get_all,

  insertProfile: insertProfile,
  getAllProfiles: getAllProfiles,
  getProfile: getProfile,
  get_similar_activities_in_range_id: get_similar_activities_in_range_id
}

// using a Promises-wrapped version of sqlite3
const db = require('./sqlWrap');
const db2 = require('./sqlWrap2');

// our activity verifier
const act = require('./activity');

// SQL commands for ActivityTable
const insertDB = "insert into ActivityTable (activity, date, amount, user) values (?,?,?, ?)"
const getOneDB = "select * from ActivityTable where activity = ? and date = ? and user = ?";
const allDB = "select * from ActivityTable where activity = ? and user = ?";
const deletePrevPlannedDB = "DELETE FROM ActivityTable WHERE user = ? and amount < 0 and date BETWEEN ? and ?";
const getMostRecentPrevPlannedDB = "SELECT rowIdNum, activity, MAX(date), amount FROM ActivityTable WHERE user = ? and amount <= 0 and date BETWEEN ? and ?";
const getMostRecentDB = "SELECT MAX(rowIdNum), activity, date, amount FROM ActivityTable";
const getPastWeekByActivityDB_ID = "SELECT * FROM ActivityTable WHERE activity = ? and date BETWEEN ? and ? and user = ? ORDER BY date ASC";

/**
 * Insert activity into the database
 * @param {Activity} activity 
 * @param {string} activity.activity - type of activity
 * @param {number} activity.date - ms since 1970
 * @param {float} activity.scalar - measure of activity conducted
 */
async function post_activity(activity) {
  try {
    await db.run(insertDB, act.ActivityToList(activity));
  } catch (error) {
    console.log("error", error)
  }
}

/**
 * Get the most recently planned activity that falls within the min and max 
 * date range
 * @param {number} min - ms since 1970
 * @param {number} max - ms since 1970
 * @returns {Activity} activity 
 * @returns {string} activity.activity - type of activity
 * @returns {number} activity.date - ms since 1970
 * @returns {float} activity.scalar - measure of activity conducted
 */
async function get_most_recent_planned_activity_in_range(user, min, max) {
  try {
    let results = await db.get(getMostRecentPrevPlannedDB, [user, min, max]);
    return (results.rowIdNum != null) ? results : null;
  }
  catch (error) {
    console.log("error", error);
    return null;
  }
}

/**
 * Get the most recently inserted activity in the database
 * @returns {Activity} activity 
 * @returns {string} activity.activity - type of activity
 * @returns {number} activity.date - ms since 1970
 * @returns {float} activity.scalar - measure of activity conducted
 */
async function get_most_recent_entry() {
  try {
    let result = await db.get(getMostRecentDB, []);
    return (result['MAX(rowIdNum)'] != null) ? result : null;
  }
  catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Get all activities that have the same activityType which fall within the 
 * min and max date range
 * @param {string} activityType - type of activity
 * @param {number} min - ms since 1970
 * @param {number} max - ms since 1970
 * @param {string} userID - logged in user
 * @returns {Array.<Activity>} similar activities
 */
async function get_similar_activities_in_range_id(activityType, min, max, user) {
  try {
    let results = await db.all(getPastWeekByActivityDB_ID, [activityType, min, max, user]);
    return results;
  }
  catch (error) {
    console.log(error);
    return [];
  }
}

/**
 * Delete all activities that have the same activityType which fall within the 
 * min and max date range
 * @param {number} min - ms since 1970
 * @param {number} max - ms since 1970
 */
async function delete_past_activities_in_range(user, min, max) {
  try {
    await db.run(deletePrevPlannedDB, [user, min, max]);
  }
  catch (error) {
    console.log(error);
  }
}

// UNORGANIZED HELPER FUNCTIONS

/**
 * Convert GMT date to UTC
 * @returns {Date} current date, but converts GMT date to UTC date
 */
function newUTCTime() {
  let gmtDate = new Date()
  return (new Date(gmtDate.toLocaleDateString())).getTime()
}

function randomNumber(min, max, round = true) { 
  let val =  Math.random() * (max - min) + min
  if (round) {
    return Math.round(val * 100) / 100
  } else {
    return Math.floor(val)
  }
}

// dumps whole table; useful for debugging
async function get_all() {
  try {
    let results = await db.all("select * from ActivityTable", []);
    return results;
  } 
  catch (error) {
    console.log(error);
    return [];
  }
}

// ProfileTable helper functions

/**
 * Insert logged in profile
 * @returns {Activity} activity 
 * @returns {string} activity.activity - type of activity
 * @returns {number} activity.date - ms since 1970
 * @returns {float} activity.scalar - measure of activity conducted
 */
const insertDBProfile = "insert into ProfileTable (userID, firstName) values (?,?)"
// 
async function insertProfile(id, name) {
  try {
    await db2.run(insertDBProfile, [id, name]);
  } catch (error) {
    console.log("error", error)
  }
}

// get ProfileTable entries
async function getAllProfiles() {
  try {
    let results = await db2.all("select * from ProfileTable", []);
    return results;
  } 
  catch (error) {
    console.log(error);
    return [];
  }
}

// get specific ProfileTable entry
async function getProfile(id) {
  try {
    let result = await db2.get("select * from ProfileTable where userID = ?", id);
    return result;
  } 
  catch (error) {
    console.log(error);
    return {};
  }
}
