import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GroupNotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  // for every notification sent there is one received. And vice versa
  notificationsTo: [
    {
      // _id given automatically by mondodb
      type: {
        type: String,
        enum: ['joinReq', 'receivedFeedback'],
      },
      groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
      to: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      isRead: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
  notificationsFrom: [
    {
      // _id given automatically by mondodb
      type: {
        type: String,
        enum: ['joinReq', 'receivedFeedback'],
      },
      groupId: { type: Schema.Types.ObjectId, ref: 'Group' },
      from: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      isRead: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],
});

const GroupNotification = mongoose.model(
  'GroupNotification',
  GroupNotificationSchema
);

export default GroupNotification;
