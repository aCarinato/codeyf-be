import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;
// AdminNotifications are typically from admin. They cannot be replied ie they cannot start a conversation

const adminNotificationSchema = new mongoose.Schema(
  {
    recipient: { type: ObjectId, ref: 'User' },
    isRead: { type: Boolean },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const AdminNotification = mongoose.model(
  'AdminNotification',
  adminNotificationSchema
);

export default AdminNotification;
