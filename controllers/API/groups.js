import Group from '../../models/Group.js';

// @desc    Create a new group
// @route   POST /api/groups/
// @access  Private
export const createNewGroup = async (req, res) => {
  //   console.log(req.user._id);
  //   console.log(req.body);
  const newGroup = req.body;
  newGroup.organiser = req.user._id;
  //   console.log(newGroup);

  try {
    // await Group.save()
    const group = new Group(newGroup);
    await group.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
