const Interview = require('../models/Interview');

// Escape user input before using in $regex to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Whitelist of fields a user is allowed to set/update
const ALLOWED_FIELDS = ['candidate_name', 'position', 'email', 'status', 'date', 'notes'];
const pick = (obj, fields) =>
  fields.reduce((acc, f) => { if (obj[f] !== undefined) acc[f] = obj[f]; return acc; }, {});

// @route GET /api/interviews
const getInterviews = async (req, res) => {
  try {
    const { name, status, position, sort } = req.query;
    const query = { user: req.user._id };

    if (name) query.candidate_name = { $regex: escapeRegex(name), $options: 'i' };
    if (status) query.status = status;
    if (position) query.position = { $regex: escapeRegex(position), $options: 'i' };

    const sortOrder = sort === 'asc' ? { date: 1 } : { date: -1 };
    const interviews = await Interview.find(query).sort(sortOrder);
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/interviews
const createInterview = async (req, res) => {
  try {
    const fields = pick(req.body, ALLOWED_FIELDS);
    const { candidate_name, position, email, date } = fields;
    if (!candidate_name || !position || !email || !date)
      return res.status(400).json({ message: 'Required fields missing' });

    const interview = await Interview.create({ user: req.user._id, ...fields });
    res.status(201).json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/interviews/:id
const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    // Only assign whitelisted fields — prevents mass assignment of 'user' or '_id'
    Object.assign(interview, pick(req.body, ALLOWED_FIELDS));
    await interview.save();
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/interviews/:id
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json({ message: 'Interview deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getInterviews, createInterview, updateInterview, deleteInterview };
