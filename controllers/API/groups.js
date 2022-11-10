import Group from '../../models/Group.js';
import GroupNotification from '../../models/GroupNotification.js';

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

// @desc    Create a new group
// @route   GET /api/groups/notifications/:userId
// @access  Private
export const getNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    // console.log('SIAMO QUA');
    // console.log(`userId: ${userId}`);

    const groupNotifications = await GroupNotification.find({
      user: userId,
    });
    // console.log(groupNotifications);
    res.status(200).json({
      success: true,
      notificationsFrom: groupNotifications[0].notificationsFrom,
      notificationsTo: groupNotifications[0].notificationsTo,
      // notifications: [
      //   { notificationsFrom: groupNotifications.notificationsFrom },
      //   { notificationsTo: groupNotifications.notificationsTo },
      // ],
    });
  } catch (err) {
    console.log(err);
  }
};
