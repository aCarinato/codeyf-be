import User from './models/User.js';
import Assignment from './models/Assignment.js';
import Group from './models/Group.js';
import GroupNotification from './models/GroupNotification.js';

import connectDB from './config/db.js';

connectDB();

const addField = async () => {
  try {
    // await User.aggregate([
    //   { $addFields: { testField: { type: String, default: 'testone' } } },
    // ]);

    // ADD A NEW DATA MODEL FOR ALL USERS
    // const users = await User.find();

    // users.forEach(async (user) => {
    //   // console.log(user);
    //   await new GroupNotification({
    //     user: user._id,
    //     notifications: [],
    //   }).save();
    // });

    // ADD A NEW FIELD TO THE GROUPS BASED ON OTHER DATA STRUCTURE FIELDS (Assignment.js)
    const groups = await Group.find();
    groups.forEach(async (group) => {
      if (group.hasProposedAssignment) {
        const retrievedGroup = await Group.findById(group._id).populate(
          'proposedAssignment'
        );

        const groupRequirements =
          retrievedGroup.proposedAssignment.requirements;

        const updatedGroupRequirements = groupRequirements.map((element) => {
          let newEl = {
            _id: element._id.toString(),
            idx: element.idx,
            label: element.label,
            met: false,
          };
          return newEl;
          // return { ...element, met: false }; -> DOES NOT WORK!
        });

        await Group.updateOne(
          { _id: group._id },
          { $set: { requirements: updatedGroupRequirements, approvals: [] } }
        );
      }
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
