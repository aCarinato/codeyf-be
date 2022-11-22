import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// A GROUP NEEDS TO HAVE AT LEAST 2 PEOPLE
const AssignmentSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  name: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: [
    {
      requirement: { type: String },
    },
  ],

  mockups: [
    {
      caption: { type: String, required: true },
      picture: {
        url: String,
        public_id: String,
      },
    },
  ],

  nBuddies: { type: Number, required: true },
  buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  buddiesFilled: { type: Boolean, default: false },
  mentorRequired: { type: Boolean, default: false },
  nMentorsRequired: { type: Number, default: 1 },
  topics: [],
  learning: [],
  picture: {
    url: String,
    public_id: String,
  },
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
