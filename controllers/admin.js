import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// @desc    Is the current user an admin?
// @route   GET /api/admin/current-admin
// @access  Private
export const currentUserIsAdmin = async (req, res) => {
  try {
    // IF YOU USE THE expressjwt middleware:
    // const user = await User.findById(req.auth._id);

    // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
    const user = await User.findById(req.user._id);
    // res.json(user);
    if (user.isAdmin) {
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

// @desc    Create a new user
// @route   POST /api/admin/create-user
// @access  Private
export const createUser = async (req, res) => {
  try {
    const { username, email, password, handle } = req.body;

    // console.log(req.body);

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      res.status(500).json(err);
    }

    const createdUser = new User({
      username,
      email,
      password: hashedPassword,
      handle,
    });
    // console.log(createdUser);
    const newUser = await createdUser.save();

    res.status(200).json({ success: true, newUser });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get users with pending approval for request to be a mentor
// @route   GET /api/admin/mentor-approval
// @access  Private (admin)
export const mentorApproval = async (req, res) => {
  try {
    const users = await User.find({ mentorPendingApproval: true });
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Approve a mentor request
// @route   PUT /api/admin/approve-mentor-req
// @access  Private (admin)
export const approveMentorRequest = async (req, res) => {
  try {
    const { id } = req.body;
    // const requestedUser = await User.findById(id)
    await User.updateOne(
      { _id: id },
      {
        $set: {
          mentorPendingApproval: false,
          isMentor: true,
          hasNotifications: true,
        },
        $push: {
          notifications:
            'Congratulations, your request to be a mentor was approved!',
        },
      }
    );

    // await User.updateOne(
    //   { _id: id },
    //   {
    //     $push: {
    //       notifications:
    //         'Congratulations, your request to be a mentor was approved!',
    //     },
    //   }
    // );

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Reject a mentor request
// @route   PUT /api/admin/reject-mentor-req
// @access  Private (admin)
export const rejectMentorRequest = async (req, res) => {
  try {
    const { id } = req.body;
    // const requestedUser = await User.findById(id)
    await User.updateOne(
      { _id: id },
      { $set: { mentorPendingApproval: false, isMentor: false } }
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
