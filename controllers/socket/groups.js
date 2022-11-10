import Notification from '../../models/Notification.js';
import GroupNotification from '../../models/GroupNotification.js';

export const setJoinReqNotification = async (senderId, receiverId, groupId) => {
  try {
    // sender
    const newNotificationTo = {
      type: 'joinReq',
      groupId: groupId,
      to: receiverId,
      text: 'You have a new request to join a team. Would you like you to?',
      isRead: false,
      date: Date.now(),
    };
    await GroupNotification.updateOne(
      {
        user: senderId,
      },
      {
        $push: { notificationsTo: newNotificationTo },
      }
    );

    // receiver
    const newNotificationFrom = {
      type: 'joinReq',
      groupId: groupId,
      from: senderId,
      text: 'You have a new request to join a team. Would you like you to?',
      isRead: false,
      date: Date.now(),
    };
    await GroupNotification.updateOne(
      {
        user: receiverId,
      },
      {
        $push: { notificationsFrom: newNotificationFrom },
      }
    );

    // const receiverNotifications = await GroupNotification.find({
    //   user: receiverId,
    // });

    // console.log(receiverNotifications);
  } catch (err) {
    console.log(err);
  }
};

export const setJoinReqNotificationSender = async (
  senderId,
  receiverId,
  groupId
) => {
  try {
    // check if a join notification for that group already exists
    const alreadyExists = await GroupNotification.find(
      {
        $and: [
          {
            $and: [
              {
                user: senderId,
              },
              {
                'notificationsTo.type': 'joinReq',
              },
            ],
          },
          {
            $and: [
              {
                'notificationsTo.groupId': groupId,
              },
              {
                'notificationsTo.to': receiverId,
              },
            ],
          },
        ],
      }
      //   {
      //     user: senderId,
      //   },

      //   {
      //     'notificationsTo.type': 'joinReq',
      //   },
      //   {
      //     'notificationsTo.groupId': groupId,
      //   },
      //   {
      //     'notificationsTo.to': receiverId,
      //   }
    );

    // console.log(alreadyExists);

    if (alreadyExists.length > 0) return { alreadyExists: true };

    // sender
    const newNotificationTo = {
      type: 'joinReq',
      groupId: groupId,
      to: receiverId,
      text: 'You have a new request to join a team. Would you like you to?',
      isRead: false,
      date: Date.now(),
    };
    await GroupNotification.updateOne(
      {
        user: senderId,
      },
      {
        $push: { notificationsTo: newNotificationTo },
      }
    );

    return { alreadyExists: false };
  } catch (err) {
    console.log(err);
  }
};

export const setJoinReqNotificationReceiver = async (
  senderId,
  receiverId,
  groupId
) => {
  try {
    // check if a join notification for that group already exists
    const alreadyExists = await GroupNotification.find({
      $and: [
        {
          $and: [
            {
              user: receiverId,
            },
            {
              'notificationsFrom.type': 'joinReq',
            },
          ],
        },
        {
          $and: [
            {
              'notificationsFrom.groupId': groupId,
            },
            {
              'notificationsFrom.from': senderId,
            },
          ],
        },
      ],
    });

    // console.log(alreadyExists);

    if (alreadyExists.length > 0) return;
    // receiver
    const newNotificationFrom = {
      type: 'joinReq',
      groupId: groupId,
      from: senderId,
      text: 'You have a new request to join a team. Would you like you to?',
      isRead: false,
      date: Date.now(),
    };
    await GroupNotification.updateOne(
      {
        user: receiverId,
      },
      {
        $push: { notificationsFrom: newNotificationFrom },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
