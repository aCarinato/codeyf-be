import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GroupNotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  notifications: [
    {
      type: {
        type: String,
        enum: ['groupJoinedAsBuddy', 'groupJoinedAsMentor', 'groupMsg'],
      },
      from: { type: Schema.Types.ObjectId, ref: 'User' },
      groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
      text: { type: String },
      isRead: { type: Boolean, default: false },
      isPending: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
});

const GroupNotification = mongoose.model(
  'GroupNotification',
  GroupNotificationSchema
);

export default GroupNotification;
