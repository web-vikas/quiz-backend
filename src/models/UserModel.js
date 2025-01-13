const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, trim: true},
    mobile: {type: String, required: true},
    name: {type: String, required: false},
    profile_image: {type: String, required: false},
    status: {
      type: String,
      required: true,
      default: 'active',
      enum: ['active', 'inactive', 'deleted'],
    },
    gender: {
      type: String,
      required: false,
      default: 'other',
      enum: ['male', 'female', 'other'],
    },
    access_token: {type: String, trim: true},
    active_session_refresh_token: {type: String, trim: true},
  },
  {timestamps: true},
);

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
