const express = require('express');
const { protect, admin } = require('../middelware/auth');
const { getUsers, deleteUser } = require('../controller/userController');
const router = express.Router();

router.get('/get-users', protect, admin, getUsers);
router.delete('/delete-user/:id', protect, admin, deleteUser);

module.exports = router;