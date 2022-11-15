import User from './models/User.js';
import GroupNotification from './models/GroupNotification.js';

import connectDB from './config/db.js';

connectDB();

const addField = async () => {
  try {
    // await User.aggregate([
    //   { $addFields: { testField: { type: String, default: 'testone' } } },
    // ]);

    // ADD A NEW DATA MODEL FOR ALL USERS
    const users = await User.find();

    users.forEach(async (user) => {
      // console.log(user);
      await new GroupNotification({
        user: user._id,
        notifications: [],
      }).save();
    });

    // // ADD A FIELD TO ALL DATA MODELS ABOVE
    // await GroupNotification.aggregate([
    //   {
    //     $addFields: { groupId: { type: Schema.Types.ObjectId, ref: 'Group' } }, // WROOONG
    //   },
    // ]);

    // await User.updateMany(
    //   {},
    //   {
    //     $set: {
    //       nNotifications: 0,
    //       conversations: [],
    //     },
    //   }
    // );
    // ----------------------------------- //
    // await Conversation.updateMany(
    //   {},
    //   {
    //     $set: {
    //       lastMessageIsRead: false,
    //     },
    //   }
    // );
    // ----------------------------------- //
    // await User.updateMany({}, { newField: 'sucaa' });
    // await User.aggregate([{ $addFields: { testField: 'testaa' } }]);
    // await User.updateOne(
    //   { username: 'ale' },
    //   { $set: { isProfileCompleted: false } }
    // );
    console.log('FATTA');
  } catch (err) {
    console.log(err);
  }
};

addField();
