import Group from '../../models/Group.js';

// @desc    Create a new group
// @route   POST /api/groups/new
// @access  Private
export const createNewGroup = async (req, res) => {
  const newGroup = req.body;
  newGroup.organiser = req.user._id;

  try {
    const group = new Group(newGroup);
    await group.save();
    res.status(200).json({ success: true, newGroupId: group._id });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Create a new group
// @route   GET /api/groups/:groupId
// @access  Public
export const getGroup = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const group = await Group.findById(groupId);
    // console.log(group);
    res.status(200).json({ success: true, group });
  } catch (err) {
    console.log(err);
  }
};
