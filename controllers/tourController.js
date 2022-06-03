const Tour = require('./../models/tourModel');

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // *1 Build query
    const queryObj = { ...req.query }; //hard copy of the object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]); // remove from query copy for filter
    // console.log(req.query, Object.keys(req.query).length, queryObj);

    // *2 Advanced filter
    let queryStr = JSON.stringify(queryObj); // convert js object into JSOn string
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryStr);
    let query = Tour.find(JSON.parse(queryStr)); // return query object, can use query object in build methods and is not promise https://stackoverflow.com/questions/53970784/mongoose-promises-documentation-says-queries-are-not-promises/53970919#53970919
    // Not await it immediately, in order to chain the query methods
    // *2a) Sort query
    // console.log(req.query);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join('');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // *3 Limiting
    // console.log(req.query.fields);
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //Exclude field
    }

    // *4 Paginations
    // default pagination
    const page = req.query.page * 1 || 1; //convert to Number or default 1
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(page, skip);
    // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30 page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // *3 Excute query
    const tours = await query; // return the documnent (in this case array type)
    // *4 Send reponse
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); //Tour.findOne({_id: req.params.id})
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }

  // const tour = tours.find((el) => {
  //   return el.id === id;
  // });

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tour,
  //   },
  // });
};

exports.patchTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, //return the new updated document
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err,
    });
  }
};
