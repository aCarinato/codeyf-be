import Group from '../../models/Group.js';

// @desc    Get all students seeking a mentor for individual project
// @route   GET /api/individuals/students/limit
// @access  Public
export const getAllStudentsSeekingMentors = async (req, res) => {
  try {
    const students = await Group.find({
      nBuddies: 1,
      mentorRequired: true,
      mentorsFilled: false,
    });

    // console.log(students);

    if (students) {
      res.status(200).json({ success: true, students });
    } else {
      res.status(200).json({ success: false, message: 'No results found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all students seeking a mentor for individual project
// @route   GET /api/individuals/students/limit
// @access  Public
export const getLimitedStudentsSeekingMentors = async (req, res) => {
  try {
    const students = await Group.find({
      nBuddies: 1,
      mentorRequired: true,
      mentorsFilled: false,
    }).limit(7);

    // console.log(students);

    if (students) {
      res.status(200).json({ success: true, students });
    } else {
      res.status(200).json({ success: false, message: 'No results found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all mentors seeking a student for individual project
// @route   GET /api/individuals/mentors/
// @access  Public
export const getAllMentorsSeekingStudents = async (req, res) => {
  try {
    const mentors = await Group.find({
      nBuddies: 1,
      buddiesFilled: false,
      mentorRequired: true,
      mentorsFilled: true,
    });

    // console.log(mentors);

    if (mentors) {
      res.status(200).json({ success: true, mentors });
    } else {
      res.status(200).json({ success: false, message: 'No results found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all mentors seeking a student for individual project
// @route   GET /api/individuals/mentors/limit
// @access  Public
export const getLimitedMentorsSeekingStudents = async (req, res) => {
  try {
    const mentors = await Group.find({
      nBuddies: 1,
      buddiesFilled: false,
      mentorRequired: true,
      mentorsFilled: true,
    }).limit(7);

    // console.log(mentors);

    if (mentors) {
      res.status(200).json({ success: true, mentors });
    } else {
      res.status(200).json({ success: false, message: 'No results found' });
    }
  } catch (err) {
    console.log(err);
  }
};
