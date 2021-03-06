const express = require('express');
// using destructor
const {
  getAllUsers,
  createUser,
  getUser,
  patchUser,
  deleteUser,
} = require('./../controllers/userController');

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(patchUser).delete(deleteUser);

module.exports = router;
