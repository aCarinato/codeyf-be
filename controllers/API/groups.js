import User from '../../models/User.js';
import Group from '../../models/Group.js';
import GroupNotification from '../../models/GroupNotification.js';

// @desc    Get all groups
// @route   GET /api/groups/
// @access  Public
export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    // console.log(groups);
    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Create a new group
// @route   POST /api/groups/new
// @access  Private
export const createNewGroup = async (req, res) => {
  const { organiserIsBuddy, organiserIsMentor, newGroup } = req.body;
  newGroup.organiser = req.user._id;

  try {
    const group = new Group(newGroup);
    await group.save();

    if (organiserIsBuddy) {
      // if the organiser wants to be a buddy add it to the buddies
      const newBuddy = await User.findById(req.user._id);
      await group.updateOne({
        $push: { buddies: newBuddy },
      });

      if (group.nBuddies === 1) {
        await group.updateOne({
          $set: { buddiesFilled: true },
        });
      }
    }

    if (organiserIsMentor) {
      const newMentor = await User.findById(req.user._id);
      await group.updateOne({
        $push: { mentors: newMentor },
      });

      if (group.nMentorsRequired === 1) {
        await group.updateOne({
          $set: { mentorsFilled: true },
        });
      }
    }

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
    const group = await Group.findById(groupId).populate(
      'organiser buddies mentors proposedAssignment'
    );
    // console.log(group);
    res.status(200).json({ success: true, group });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get all group notifications for the user
// @route   GET /api/groups/:userId
// @access  Private
export const getNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    // console.log('SIAMO QUA');
    // console.log(`userId: ${userId}`);

    const groupNotifications = await GroupNotification.find({
      user: userId,
    });
    // console.log(`from API getNotifications`);
    // console.log(groupNotifications);
    res.status(200).json({
      success: true,
      notifications: groupNotifications[0].notifications,
      // notificationsFrom: groupNotifications[0].notificationsFrom,
      // notificationsTo: groupNotifications[0].notificationsTo,
      // notifications: [
      //   { notificationsFrom: groupNotifications.notificationsFrom },
      //   { notificationsTo: groupNotifications.notificationsTo },
      // ],
    });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get the groups managed (created) by a user
// @route   GET /api/groups/notifications/:userId
// @access  Private
export const getUserGroups = async (req, res) => {
  const userId = req.params.userId;
  try {
    const groups = await Group.find({ organiser: userId });
    res.status(200).json({ success: true, groups });
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get the
// @route   GET /api/groups/notification-from/:userId/:notificationId
// @access  Private
export const getNotificationFrom = async (req, res) => {
  const userId = req.params.userId;
  const notificationId = req.params.notificationId;
  try {
    const notification = await GroupNotification.find({
      'notifications._id': notificationId,
      // user: userId,
      // 'notifications.$.type': 'groupJoined', // it's an enumeration!! you need .$.
    }).populate('notifications.type notifications.groupId');
    // console.log('Notification');
    // console.log(notification[0].notifications);
    if (notification) {
      let selectedNotification;
      selectedNotification = notification[0].notifications.filter(
        (notification) => notification._id.toString() === notificationId
      )[0];
      // console.log('selectedNotification');
      // console.log(selectedNotification);
      res
        .status(200)
        .json({ success: true, notification: selectedNotification });
    }
  } catch (err) {
    console.log(err);
  }
};

// @desc    Get the
// @route   GET /api/groups/group/pending-join-reqs
// @access  Private
export const getPendingRequests = async (req, res) => {
  try {
    // const userId = req.params.userId;
    const userId = req.user._id;
    const pendingReqs = await GroupNotification.find(
      { user: userId },
      { 'notificationsFrom.type': 'joinReq' }
    );

    // console.log(pendingReqs);

    // if (pendingReqs)
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};

// // @desc    Get requirements for a specified group
// // @route   GET /api/groups/:groupId/requirements
// // @access  Public
// export const getRequirements = async (req, res) => {
//   const groupId = req.params.groupId;

//   try {
//     const group = await Group.findById(groupId);

//     // check if group has requirements
//     if (
//       group.hasProposedAssignment &&
//       group.requirements &&
//       group.requirements.length > 0
//     ) {
//       res.status(200).json({ success: true, requirements: group.requirements });
//     } else {
//       res.status(200).json({
//         success: false,
//         message: 'This group does not have requirements',
//       });
//     }
//     // console.log(group);
//   } catch (err) {
//     console.log(err);
//   }
// };

// @desc    Check a requirement as met or not
// @route   PUT /api/groups/group/check-requirement
// @access  Private
export const checkRequirement = async (req, res) => {
  try {
    const { groupId, requirementId } = req.body;
    // console.log(`groupId: ${groupId}, requirementId: ${requirementId}`);

    // set it
    const group = await Group.findById(groupId);

    const requIdx = group.requirements
      .map((item) => item.idx)
      .indexOf(requirementId);

    // let res;
    if (group.requirements[requIdx].met === true) {
      await Group.updateOne(
        { _id: groupId, 'requirements.idx': requirementId },
        { $set: { 'requirements.$.met': false } }
      );
    } else {
      // console.log(
      //   `group.requirements[requIdx].met: ${group.requirements[requIdx].met}`
      // );
      // console.log('sto qua sul false');
      await Group.updateOne(
        { _id: groupId, 'requirements.idx': requirementId },
        { $set: { 'requirements.$.met': true } }
      );
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
