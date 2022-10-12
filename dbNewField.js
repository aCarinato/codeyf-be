import User from './models/User.js';
import Conversation from './models/Conversation.js';

import connectDB from './config/db.js';

connectDB();

const addField = async () => {
  try {
    // await User.aggregate([
    //   { $addFields: { testField: { type: String, default: 'testone' } } },
    // ]);
    await User.updateMany(
      {},
      {
        $set: {
          nNotifications: 0,
          conversations: [],
        },
      }
    );
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
