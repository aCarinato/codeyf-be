import GroupNotification from '../../models/GroupNotification.js';
import Group from '../../models/Group.js';
import User from '../../models/User.js';

export const joinGroupReq = async (organiserId, groupId, userToAddId, type) => {
  try {
    const userHasNotifications = await GroupNotification.findOne({
      user: userToAddId,
    });

    // should check if the person is already in the group
    // check if there are already pending notifications of this type
    // create a notification of the right type that will be pending till approval
    if (
      userHasNotifications !== null &&
      userHasNotifications !== undefined &&
      userHasNotifications !== {}
    ) {
      let newNotification;
      if (type === 'buddy') {
        newNotification = {
          type: 'joinAsBuddyReq',
          from: organiserId,
          text: `You have a request to join a group as a buddy`,
          groupId: groupId,
          isRead: false,
          isPending: true,
          date: Date.now(),
        };
      } else if (type === 'mentor') {
        newNotification = {
          type: 'joinAsMentorReq',
          from: organiserId,
          text: `You have a request to join a group as a buddy`,
          groupId: groupId,
          isRead: false,
          isPending: true,
          date: Date.now(),
        };
      }

      // should check that the user has a notification model (when you delete it it doesn't)

      await GroupNotification.updateOne(
        { user: userToAddId },
        {
          $push: { notifications: newNotification },
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

export const addUserToGroup = async (groupId, userToAddId, type) => {
  if (type === 'buddy') {
    const alreadyExists = await addBuddyToGroup(groupId, userToAddId);
    return alreadyExists;
  }

  if (type === 'mentor') {
    const alreadyExists = await addMentorToGroup(groupId, userToAddId);
    return alreadyExists;
  }
};

export const saveGroupJoinedNotification = async (
  organiserId,
  userToAddId,
  groupId,
  type
) => {
  if (type === 'buddy') {
    await saveGroupJoinedAsBuddyNotification(organiserId, userToAddId, groupId);
  }

  if (type === 'mentor') {
    await saveGroupJoinedAsMentorNotification(
      organiserId,
      userToAddId,
      groupId
    );
  }
};

export const readGroupJoinedNotification = async (notificationId) => {
  console.log('');
  // console.log(
  //   `10) FROM socket controller 'group.js' -  readGroupJoinedNotification() = notificationId: ${notificationId}`
  // );
  const notification = await GroupNotification.updateOne(
    { 'notifications._id': notificationId },
    { $set: { 'notifications.$.isRead': true } }
  );
  // console.log(notification);
};

export const addBuddyToGroup = async (groupId, buddyId) => {
  // check if in the group there is already that buddy

  const retrievedGroup = await Group.find({
    $and: [{ _id: groupId }, { buddies: { _id: buddyId } }],
  });
  // console.log(retrievedGroup);

  // if (retrievedGroup.buddiesFilled === false) {
  const alreadyExists = retrievedGroup.length > 0;
  // console.log(alreadyExists);
  if (alreadyExists) {
    return alreadyExists;
  } else {
    // retrive the buddy
    const newBuddy = await User.findById(buddyId);
    // this assumes it is not possible to get to here if the group is already filled! (check frontend)
    await Group.updateOne(
      {
        _id: groupId,
      },
      {
        $push: { buddies: newBuddy },
      }
    );

    // if after adding new buddy the group is filled, mark it as 'filled'
    const updatedGroup = await Group.findById(groupId);

    if (updatedGroup.nBuddies === updatedGroup.buddies.length) {
      await updatedGroup.updateOne({
        $set: { buddiesFilled: true },
      });
    }

    return alreadyExists;
  }
  // } // here i could return an error message to the frontend (buddy positions already filled)
};

export const addMentorToGroup = async (groupId, mentorId) => {
  const retrievedGroup = await Group.find({
    $and: [{ _id: groupId }, { mentors: { _id: mentorId } }],
  });
  // console.log('');
  // console.log(`from groups.js - 'addMentorToGroup' => retrievedGroup:`);
  // console.log(retrievedGroup);
  // console.log('');

  const alreadyExists = retrievedGroup.length > 0;
  // console.log(
  //   `from groups.js - 'addMentorToGroup' => alreadyExists: ${alreadyExists}`
  // );

  // TODO - Check if the group has already mentor position filled
  if (alreadyExists) {
    return alreadyExists;
  } else {
    // retrive the buddy
    const newMentor = await User.findById(mentorId);
    // this assumes it is not possible to get to here if the group is already filled! (check frontend)
    await Group.updateOne(
      {
        _id: groupId,
      },
      {
        $push: { mentors: newMentor },
      }
    );

    // if after adding new buddy the group is filled, mark it as 'filled'
    const updatedGroup = await Group.findById(groupId);
    if (
      Number(updatedGroup.nMentorsRequired) ===
      Number(updatedGroup.mentors.length)
    ) {
      await updatedGroup.updateOne({
        $set: { mentorsFilled: true },
      });
    }

    return alreadyExists;
  }
  // } // here i could return an error message to the frontend (mentor positions already filled)
};

export const saveGroupJoinedAsBuddyNotification = async (
  organiserId,
  userToAddId,
  groupId
) => {
  try {
    const newNotification = {
      type: 'groupJoinedAsBuddy',
      from: organiserId,
      text: `You have been added to a new team as a buddy`,
      groupId: groupId,
      isRead: false,
      date: Date.now(),
    };
    // should check that the user has a notification model (when you delete it it doesn't)

    await GroupNotification.updateOne(
      { user: userToAddId },
      {
        $push: { notifications: newNotification },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const saveGroupJoinedAsMentorNotification = async (
  organiserId,
  userToAddId,
  groupId
) => {
  try {
    const newNotification = {
      type: 'groupJoinedAsMentor',
      from: organiserId,
      text: `You have been added to a new team as a mentor`,
      groupId: groupId,
      isRead: false,
      date: Date.now(),
    };

    // console.log(
    //   `7) from API saveGroupJoinedNotification() newNotification: ${JSON.stringify(
    //     newNotification
    //   )}`
    // );

    await GroupNotification.updateOne(
      { user: userToAddId },
      {
        $push: { notifications: newNotification },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

// --------- OLD OLD OLD ------- //
// export const setJoinReqNotification = async (senderId, receiverId, groupId) => {
//   try {
//     // sender
//     const newNotificationTo = {
//       type: 'joinReq',
//       groupId: groupId,
//       to: receiverId,
//       text: 'You have a new request to join a team. Would you like you to?',
//       isRead: false,
//       date: Date.now(),
//     };
//     await GroupNotification.updateOne(
//       {
//         user: senderId,
//       },
//       {
//         $push: { notificationsTo: newNotificationTo },
//       }
//     );

//     // receiver
//     const newNotificationFrom = {
//       type: 'joinReq',
//       groupId: groupId,
//       from: senderId,
//       text: 'You have a new request to join a team. Would you like you to?',
//       isRead: false,
//       date: Date.now(),
//     };
//     await GroupNotification.updateOne(
//       {
//         user: receiverId,
//       },
//       {
//         $push: { notificationsFrom: newNotificationFrom },
//       }
//     );

//     // const receiverNotifications = await GroupNotification.find({
//     //   user: receiverId,
//     // });

//     // console.log(receiverNotifications);
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const setJoinReqNotificationSender = async (
//   senderId,
//   receiverId,
//   groupId
// ) => {
//   try {
//     // check if a join notification for that group already exists
//     const alreadyExists = await GroupNotification.find(
//       {
//         $and: [
//           {
//             $and: [
//               {
//                 user: senderId,
//               },
//               {
//                 'notificationsTo.type': 'joinReq',
//               },
//             ],
//           },
//           {
//             $and: [
//               {
//                 'notificationsTo.groupId': groupId,
//               },
//               {
//                 'notificationsTo.to': receiverId,
//               },
//             ],
//           },
//         ],
//       }
//       //   {
//       //     user: senderId,
//       //   },

//       //   {
//       //     'notificationsTo.type': 'joinReq',
//       //   },
//       //   {
//       //     'notificationsTo.groupId': groupId,
//       //   },
//       //   {
//       //     'notificationsTo.to': receiverId,
//       //   }
//     );

//     // console.log(alreadyExists);

//     if (alreadyExists.length > 0) return { alreadyExists: true };

//     // sender
//     const newNotificationTo = {
//       type: 'joinReq',
//       groupId: groupId,
//       to: receiverId,
//       text: 'You have a new request to join a team. Would you like you to?',
//       isRead: false,
//       date: Date.now(),
//     };
//     await GroupNotification.updateOne(
//       {
//         user: senderId,
//       },
//       {
//         $push: { notificationsTo: newNotificationTo },
//       }
//     );

//     return { alreadyExists: false };
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const setJoinReqNotificationReceiver = async (
//   senderId,
//   receiverId,
//   groupId
// ) => {
//   try {
//     // check if a join notification for that group already exists
//     const alreadyExists = await GroupNotification.find({
//       $and: [
//         {
//           $and: [
//             {
//               user: receiverId,
//             },
//             {
//               'notificationsFrom.type': 'joinReq',
//             },
//           ],
//         },
//         {
//           $and: [
//             {
//               'notificationsFrom.groupId': groupId,
//             },
//             {
//               'notificationsFrom.from': senderId,
//             },
//           ],
//         },
//       ],
//     });

//     // console.log(alreadyExists);

//     if (alreadyExists.length > 0) return;
//     // receiver
//     const newNotificationFrom = {
//       type: 'joinReq',
//       groupId: groupId,
//       from: senderId,
//       text: 'You have a new request to join a team. Would you like you to?',
//       isRead: false,
//       date: Date.now(),
//     };
//     await GroupNotification.updateOne(
//       {
//         user: receiverId,
//       },
//       {
//         $push: { notificationsFrom: newNotificationFrom },
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const readJoinReqNotification = async (
//   senderId,
//   receiverId,
//   groupId
// ) => {
//   try {
//     await GroupNotification.updateOne(
//       {
//         $and: [
//           {
//             $and: [
//               {
//                 user: receiverId,
//               },
//               {
//                 'notificationsFrom.type': 'joinReq',
//               },
//             ],
//           },
//           {
//             $and: [
//               {
//                 'notificationsFrom.groupId': groupId,
//               },
//               {
//                 'notificationsFrom.from': senderId,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         $set: { 'notificationsFrom.$.isRead': true },
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const setJoinResNotificationSender = async (
//   senderId,
//   // receiverId,
//   groupId,
//   joinRes
// ) => {
//   try {
//     // check if a join notification for that group already exists
//     // send a notification to yourself ie from yourself
//     const alreadyExists = await GroupNotification.find({
//       $and: [
//         {
//           $and: [
//             {
//               user: senderId,
//             },
//             {
//               'notificationsFrom.type': 'joinRes',
//             },
//           ],
//         },
//         {
//           $and: [
//             {
//               'notificationsFrom.groupId': groupId,
//             },
//             {
//               'notificationsFrom.from': senderId,
//             },
//           ],
//         },
//       ],
//     });

//     // console.log(alreadyExists);

//     if (alreadyExists.length > 0) return { alreadyExists: true };

//     // sender
//     const newNotificationFrom = {
//       type: 'joinRes',
//       groupId: groupId,
//       from: senderId,
//       text: joinRes,
//       isRead: true, // NOTE THAT THIS DOESN'T NEED TO BE READ
//       date: Date.now(),
//     };
//     await GroupNotification.updateOne(
//       {
//         user: senderId,
//       },
//       {
//         $push: { notificationsFrom: newNotificationFrom },
//       }
//     );

//     return { alreadyExists: false };
//   } catch (err) {
//     console.log(err);
//   }
// };
