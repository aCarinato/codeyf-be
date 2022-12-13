import Assignment from '../../models/Assignment.js';

// @desc    Get all assignments
// @route   GET /api/assignments/
// @access  Public
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    // console.log(groups);
    res.status(200).json({ success: true, assignments });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments/limit
// @access  Public
export const getLimitedAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().limit(7);
    // console.log(groups);
    res.status(200).json({ success: true, assignments });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Create a new assignment
// @route   POST /api/assignments/new
// @access  Private
export const createNewAssignment = async (req, res) => {
  try {
    // console.log(req.body);
    const { newAssignment } = req.body;
    newAssignment.createdBy = req.user._id;
    const assignment = new Assignment(newAssignment);
    await assignment.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get an assignment by its id
// @route   GET /api/assignment/:assignmentId
// @access  Public
export const getAssignment = async (req, res) => {
  const assignmentId = req.params.assignmentId;
  // console.log(assignmentId);
  try {
    const assignment = await Assignment.findById(assignmentId).populate(
      'createdBy'
    );
    // console.log(group);
    res.status(200).json({ success: true, assignment });
  } catch (err) {
    console.log(err);
  }
};
