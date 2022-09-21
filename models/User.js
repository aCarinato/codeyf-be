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
    shortDescription: {
      type: String,
      // required: true,
      // minlength: 6,
    },
    // longDescription: {
    //   type: String,
    //   //   required: true,
    //   // minlength: 6,
    // },
    // interests: {
    //   // array with id of interests
    //   type: [String],
    //   // required: true,
    //   // minlength: 6,
    // },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User;
