import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// A GROUP NEEDS TO HAVE AT LEAST 2 PEOPLE
const GroupSchema = new Schema(
  {
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
    deadline: { type: Date },
    organiser: { type: Schema.Types.ObjectId, ref: 'User' },
    nBuddies: { type: Number, required: true },
    buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    buddiesFilled: { type: Boolean, default: false },
    mentorRequired: { type: Boolean, default: false },
    nMentorsRequired: { type: Number, default: 1 },
    mentors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mentorsFilled: { type: Boolean, default: false },
    topics: [],
    learning: [],
    hasProposedAssignment: { type: Boolean, default: false },
    proposedAssignment: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      // default: '',
    },
    //   proposedProjectLink: '',

    requirements: [
      // {
      //   idx: { type: String },
      //   label: { type: String },
      //   met: { type: Boolean, default: false },
      // },
    ],
    approvals: [
      {
        participant: { type: Schema.Types.ObjectId, ref: 'User' },
        approved: { type: Boolean, default: false },
      },
    ],

    isClosed: { type: Boolean, default: false },
    picture: {
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

const Group = mongoose.model('Group', GroupSchema);
export default Group;
