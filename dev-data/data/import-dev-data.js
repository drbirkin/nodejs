const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
// enviroments variables
dotenv.config({ path: '../../config.env' }); //read from file and save to nodejs enviroment variable

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    // console.log(con);
    console.log('==============================');
    // console.log(con.connections);
  });

// Read JSON file
const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8')); //readfileSync returns in String (Our JSON is an big Array)

// Import data into Database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Delete all data from Dashboard
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Command line application
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
//Command line log
console.log(process.argv);
