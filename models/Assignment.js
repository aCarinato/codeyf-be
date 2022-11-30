import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// A GROUP NEEDS TO HAVE AT LEAST 2 PEOPLE
const AssignmentSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  headline: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  completionTime: { type: Number }, // n. days
  topics: [],
  learning: [],
  requirements: [
    {
      idx: { type: String },
      label: { type: String },
    },
  ],
  repo: {
    type: String,
  },
  mockups: [
    {
      caption: { type: String },
      picture: {
        url: String,
        public_id: String,
      },
    },
  ],
  maxTeamMemebers: {
    type: Number,
    required: true,
  },
  idealTeam: [
    {
      idx: { type: String },
      nPeople: { type: Number },
      role: { type: String },
    },
  ],
  steps: [
    {
      n: { type: String },
      tasks: [
        {
          roleId: {
            type: String,
          },
          roleTasks: {
            type: String,
          },
        },
      ],
    },
  ],

  //   nBuddies: { type: Number, required: true },
  //   buddies: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  //   buddiesFilled: { type: Boolean, default: false },
  //   mentorRequired: { type: Boolean, default: false },
  //   nMentorsRequired: { type: Number, default: 1 },

  //   picture: {
  //     url: String,
  //     public_id: String,
  //   },
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
