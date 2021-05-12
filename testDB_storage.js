// garbo


// Testing function loads some data into DB. 
// Is called when app starts up to put fake 
// data into db for testing purposes.
// Can be removed in "production". 
async function testDB () {
  
  // for testing, always use today's date
  const today = new Date().getTime();
  
  // all DB commands are called using await
  
  // empty out database - probably you don't want to do this in your program
  await db.deleteEverything();
  
  const MS_IN_DAY = 86400000
  let newDate =  new Date(); // today!
  let startDate = newDate.getTime() - 7 * MS_IN_DAY;
  let planDate3 = newDate.getTime() - 3 * MS_IN_DAY;
  let planDate2 = newDate.getTime() - 2 * MS_IN_DAY;
  console.log("today:", startDate)
  
  let dbData = [
    {
      type: 'walk',
      data: Array.from({length: 8}, () => randomNumber(0,1)),
      start: startDate
    },
    {
      type: 'run',
      data: Array.from({length: 8}, () => randomNumber(1,3)),
      start: startDate
    },
    {
      type: 'swim',
      data: Array.from({length: 8}, () => randomNumber(30, 100, false)),
      start: startDate
    },
    {
      type: 'bike',
      data: Array.from({length: 8}, () => randomNumber(5,10)),
      start: startDate
    },
    {
      type: 'yoga',
      data: Array.from({length: 8}, () => randomNumber(30,120,false)),
      start: startDate
    },
    {
      type: 'soccer',
      data: Array.from({length: 8}, () => randomNumber(120,180,false)),
      start: startDate
    },
    {
      type: 'basketball',
      data: Array.from({length: 8}, () => randomNumber(60,120,false)),
      start: startDate
    },
  ]
  
  for(const entry of dbData) {
    for(let i = 0 ; i < entry.data.length; i++) {
      await db.run(insertDB,[entry.type, entry.start + i * MS_IN_DAY, entry.data[i]]);
    }
  }
  

  await db.run(insertDB,["yoga", planDate2, -1]);
  await db.run(insertDB,["yoga", planDate3, -1]);
  await db.run(insertDB,["run", planDate2, -1]);

  // some examples of getting data out of database
  
  // look at the item we just inserted
  let result = await db.get(getOneDB,["run",startDate]);
  console.log("sample single db result",result);
  
  // get multiple items as a list
  result = await db.all(allDB,["walk"]);
  console.log("sample multiple db result",result);
}
