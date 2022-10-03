import User from '../models/User.js';

// @desc    Completing user's profile
// @route   PUT /api/user/complete-profile
// @access  Private
export const completeProfile = async (req, res) => {
  const {
    shortDescription,
    longDescription,
    country,
    languages,
    availability,
    topics,
    learning,
    teaching,
    yearsExperience,
    companyJob,
    linkedin,
    skillsLevel,
  } = req.body;

  // IF YOU USE THE 'SELF-MADE' (requireSignin) MIDDLEWARE:
  // const user = await User.findById(req.user._id);
  // console.log(user);
  let user;
  try {
    user = await User.findById(req.user._id);
  } catch (err) {
    console.log(err);
  }

  if (user) {
    const userID = user._id;
    await User.updateOne(
      { _id: userID },
      {
        $set: {
          registrationCompleted: true,
          country: country,
          shortDescription: shortDescription,
          longDescription: longDescription,
          languages: languages,
          topics: topics,
          isBuddy: availability[0],
          isMentor: availability[1],
          learning: learning,
          teaching: teaching,
          skillsLevel: skillsLevel,
          yearsExperience,
          companyJob,
          linkedin,
          mentorPendingApproval: true,
        },
      }
    );

    res.status(200).json({ success: true, message: `Profile completed!` });
  } else {
    return res.json({
      error: 'User not found!',
    });
  }
};

// @desc    Completing user's profile
// @route   PUT /api/user/complete-profile
// @access  Private
export const deleteProfile = async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: 'profile deleted' });
  } catch (err) {
    console.log(err);
  }
};