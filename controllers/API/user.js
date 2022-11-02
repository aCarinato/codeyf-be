import User from '../../models/User.js';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// @desc    Get user by email
// @route   POST /api/user/
// @access  Private
export const getUser = async (req, res) => {
  const { email } = req.body;

  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
  }

  if (user) {
    res.status(200).json({ success: true, user: user });
  }
};

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
    mentorPendingApproval,
    topics,
    learning,
    teaching,
    yearsExperience,
    companyJob,
    linkedin,
    github,
    skillsLevel,
    image,
  } = req.body;

  let replacedCompanyJob;
  // let mentorPendingApproval;
  if (companyJob === null) {
    replacedCompanyJob = false;
    // mentorPendingApproval = false;
  } else {
    replacedCompanyJob = companyJob;
    // mentorPendingApproval = true;
  }
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
          // the following will become true if the mentor request will be approved
          isMentor: false,
          mentorPendingApproval,
          learning: learning,
          teaching: teaching,
          skillsLevel: skillsLevel,
          yearsExperience,
          replacedCompanyJob,
          linkedin,
          github,
          profilePic: image,
        },
        // $push: {
        //   notifications:
        //     'Congratulations, your request to be a mentor was approved!',
        // },
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

// @desc    Read notifications
// @route   PUT /api/user/read-notifications
// @access  Private
export const readNotifications = async (req, res) => {
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
          hasNotifications: false,
        },
      }
    );

    res.status(200).json({ success: true });
  }
};

export const uploadImage = async (req, res) => {
  // console.log('req files => ', req.files);
  try {
    const result = await cloudinary.uploader.upload(req.files.image.path);
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.log(`Error in the API: ${err}`);
  }
};
