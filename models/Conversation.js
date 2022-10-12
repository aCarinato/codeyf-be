import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

// Conversation is meant to be between 2 users

const conversationSchema = new mongoose.Schema(
  {
    lastMessageIsRead: { type: Boolean },
    firstUser: { type: ObjectId, ref: 'User' },
    secondUser: { type: ObjectId, ref: 'User' },
    messages: {
      type: [ObjectId],
      ref: 'Message',
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
