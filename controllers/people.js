import User from '../models/User.js';

// export const getPeople = (req, res) => {
//   try {
//     res.json({ message: 'Hello from the server!' });
//   } catch (err) {
//     console.log(err);
//   }
// };

export const getBuddies = async (req, res) => {
  try {
    const buddies = await User.find({ isBuddy: true });

    if (buddies) {
      res.status(200).json({ success: true, buddies });
    } else {
      res.status(200).json({ success: false, message: 'Buddies not found' });
    }
  } catch (err) {
    console.log(err);
  }
};

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
