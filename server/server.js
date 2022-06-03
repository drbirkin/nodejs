const mongoose = require('mongoose');
const dotenv = require('dotenv');
// enviroments variables
dotenv.config({ path: '../config.env' }); //read from file and save to nodejs enviroment variable

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// console.log(DB);
// console.log(process.env);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,  //not supported
    // useFindAndModify: false, //not supported
  })
  .then(() => {
    // console.log(con);
    console.log('==============================');
    // console.log(con.connections);
  });

// dbConnect().catch((err) => console.log(err));

// async function dbConnect() {
//   await mongoose.connect(DB);
//   console.log('Connected');
// }

// Testing modell
// const testTour = new Tour({
//   name: 'The Forest Hiker V4',
//   rating: 4.7,
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log(`Error: ${err}`));

const app = require('../app');
// console.log(process.env);
// console.log(app.get('env')); //express env
// console.log(process.env); //nodejs env (from process cor)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
/**
 * equest sent to server

     -> server.js

          -> app.js (res and req object go through all the middlewares)

               -> routes (depends on the path, handled by respective router - userRoutes/tourRoutes)

                    -> controllers (depend on which HTTP method, handled by respective controllers - userControllers/tourControllers)

                         -> END of the request-response flo
 */
