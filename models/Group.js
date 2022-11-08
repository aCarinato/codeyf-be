import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organiser: { type: Schema.Types.ObjectId, ref: 'User' },
  nBuddies: { type: Number, required: true },
  buddies: [],
  buddiesFilled: { type: Boolean, default: false },
  mentorRequired: { type: Boolean, default: false },
  nMentorsRequired: { type: Number, default: 1 },
  mentors: [],
  mentorsFilled: { type: Boolean, default: false },
  topics: [],
  learning: [],
  hasProposedAssignment: { type: Boolean, default: false },
  //   proposedAssignmentID: '0',
  //   proposedProjectLink: '',
  isClosed: { type: Boolean, default: false },
  picture: {
    url: String,
    public_id: String,
  },
});

const Group = mongoose.model('Group', GroupSchema);
export default Group;
