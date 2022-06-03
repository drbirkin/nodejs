const express = require('express');
const morgan = require('morgan');

// Express order matters
const app = express();

// 1) Middlewares
app.use(express.json()); //To assign request.body()

// custom middleware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3rd party middleware morgan
app.use(morgan('dev'));

// 2) Resource handlers
// app.get(`/`, (req, res) => {
//   //   res.status(200).send(`Hello from the serverside`);
//   res
//     .status(200)
//     .json({ message: `Hello from the serverside`, app: `Natours` });
// });

// app.post(`/`, (req, res) => {
//   res.send('You can post to this endpoint');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  //   push to the array
  tours.push(newTour);
  // add to the tourssimple.json file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) throw err;
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const getAllTours = (req, res) => {
  //   console.log(tours);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  if (id > tours.length)
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid id',
    });

  const tour = tours.find((el) => {
    return el.id === id;
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

const patchTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid id',
    });
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tours>',
    },
  });
};

const deleteTour = (req, res) => {
  const id = req.params.id * 1;
  // const tour = tours.filter((el) => el.id !== id);
  const tour = tours.find((el) => {
    return el.id === id;
  });
  const newTours = tours.filter((el) => el.id !== id);
  if (!tour)
    return res.status(404).json({
      status: 'Failed',
      message: 'Invalid id',
    });
  // console.log(tour.length, id);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(newTours),
    (err) => {
      if (err) throw err;
      // status code 204 wont log any msg or data (even u manual add them)
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const patchUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

// 3) Routes
// middleware router objects
const tourRouter = express.Router();
const userRouter = express.Router();

// tourRouter.post('/api/v1/tours', createTour);
// tourRouter.get('/api/v1/tours', getAllTours);
tourRouter.route('/').get(getAllTours).post(createTour);
// tourRouter.get('/api/v1/tours/:id', getTour);
// tourRouter.patch('/api/v1/tours/:id', patchTour);
// tourRouter.delete('/api/v1/tours/:id', deleteTour);
tourRouter.route('/:id').get(getTour).patch(patchTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);
// mount the rounters on root
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
