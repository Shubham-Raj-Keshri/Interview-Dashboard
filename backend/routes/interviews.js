const express = require('express');
const { getInterviews, createInterview, updateInterview, deleteInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.use(protect); // All interview routes are protected

router.route('/').get(getInterviews).post(createInterview);
router.route('/:id').put(updateInterview).delete(deleteInterview);

module.exports = router;
