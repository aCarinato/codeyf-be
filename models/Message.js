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
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
