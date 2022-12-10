import User from '../../models/User.js';

// export const getPeople = (req, res) => {
//   try {
//     res.json({ message: 'Hello from the server!' });
//   } catch (err) {
//     console.log(err);
//   }
// };

// @desc    Get all buddies
// @route   GET /api/people/buddies
// @access  Public
export const getAllBuddies = async (req, res) => {
  try {
    const buddies = await User.find({
      isBuddy: true,
    });

    if (buddies) {
      res.status(200).json({ success: true, buddies });
    } else {
      res.status(200).json({ success: false, message: 'Buddies not found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all buddies
// @route   GET /api/people/buddies/limited
// @access  Public
export const getLimitedBuddies = async (req, res) => {
  try {
    const buddies = await User.find({
      isBuddy: true,
    }).limit(7);

    if (buddies) {
      res.status(200).json({ success: true, buddies });
    } else {
      res.status(200).json({ success: false, message: 'Buddies not found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all mentors
// @route   GET /api/people/mentors
// @access  Public
export const getAllMentors = async (req, res) => {
  try {
    // const { userEmail } = req.body;
    const mentors = await User.find({
      isMentor: true,
      // email: { $ne: userEmail },
    });

    if (mentors) {
      res.status(200).json({ success: true, mentors });
    } else {
      res.status(200).json({ success: false, message: 'Mentors not found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all mentors
// @route   GET /api/people/mentors/limit
// @access  Public
export const getLimitedMentors = async (req, res) => {
  try {
    // const { userEmail } = req.body;
    const mentors = await User.find({
      isMentor: true,
      // email: { $ne: userEmail },
    }).limit(7);

    if (mentors) {
      res.status(200).json({ success: true, mentors });
    } else {
      res.status(200).json({ success: false, message: 'Mentors not found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get a buddy for a specified handle
// @route   GET /api/people/student/:handle
// @access  Public
export const getStudent = async (req, res) => {
  try {
    const handle = req.params.handle;

    const user = await User.findOne({ handle: handle, isBuddy: true });

    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(200).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get a mentor for a specified handle
// @route   GET /api/people/mentor/:handle
// @access  Public
export const getMentor = async (req, res) => {
  try {
    const handle = req.params.handle;

    const user = await User.findOne({ handle: handle, isMentor: true });

    if (user) {
      res.status(200).json({ success: true, user });
    } else {
      res.status(200).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    console.log(err);
  }
};
