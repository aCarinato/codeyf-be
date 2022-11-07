import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    handle: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    resetPasswordLink: {
      type: String,
      default: '',
    },
    registrationCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    hasNotifications: {
      type: Boolean,
      default: false,
    },
    nNotifications: {
      type: Number,
      default: 0,
    },
    mentorPendingApproval: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      url: String,
      public_id: String,
    },
    isBuddy: {
      type: Boolean,
      // required: true,
      default: true,
    },
    isMentor: {
      type: Boolean,
      // required: true,
      default: false,
    },
    currentlyAvailableAsBuddy: {
      type: Boolean,
      default: true,
    },
    currentlyAvailableAsMentor: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    country: {
      type: String,
    },
    languages: {
      type: Array,
    },
    shortDescription: {
      type: String,
      // required: true,
      // minlength: 6,
    },
    longDescription: {
      type: String,
      //   required: true,
      // minlength: 6,
    },
    topics: {
      type: Array,
    },
    learning: {
      type: Array,
    },
    skillsLevel: {
      type: Array,
    },
    companyJob: {
      type: Boolean,
    },
    yearsExperience: {
      type: Number,
    },
    linkedin: {
      type: String,
    },
    github: {
      type: String,
    },
    teaching: {
      type: Array,
    },
    // notifications are typically from admin. They cannot be replied ie they cannot start a conversation
    // notifications: {
    //   type: [ObjectId],
    //   ref: 'AdminNotification',
    // },
    // conversations: {
    //   type: [ObjectId],
    //   ref: 'Conversation',
    // },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
