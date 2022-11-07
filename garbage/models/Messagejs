import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: ObjectId,
      ref: 'User',
    },
    to: {
      type: ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
    },
    // a message could have its associated notification
    DMNotification: {
      type: ObjectId,
      ref: 'DMNotification',
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
