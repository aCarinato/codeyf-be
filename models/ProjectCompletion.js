import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// A GROUP NEEDS TO HAVE AT LEAST 2 PEOPLE
const ProjectCompletionSchema = new Schema({
  project: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  requirements: [
    {
      idx: { type: String },
      label: { type: String },
      met: { type: Boolean },
    },
  ],
  approvals: [
    {
      participant: { type: Schema.Types.ObjectId, ref: 'User' },
      approved: { type: Boolean, default: false },
    },
  ],
});

const ProjectCompletion = mongoose.model(
  'ProjectCompletion',
  ProjectCompletionSchema
);
export default ProjectCompletion;
