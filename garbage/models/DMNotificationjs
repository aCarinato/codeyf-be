import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;
// AdminNotifications are typically from admin. They cannot be replied ie they cannot start a conversation

const DMNotificationSchema = new mongoose.Schema(
  {
    DM: { type: ObjectId, ref: 'Message' },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const DMNotification = mongoose.model('DMNotification', DMNotificationSchema);

export default DMNotification;
