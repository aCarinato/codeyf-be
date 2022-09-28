import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // unique: true,
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
    currentlyAvailable: {
      type: Boolean,
      default: true,
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
    teaching: {
      type: Array,
    },
    skillsLevel: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
