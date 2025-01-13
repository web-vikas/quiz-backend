const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPSchema = new Schema(
  {
    email: {type: String, required: true, trim: true, unique: true},
    otp: {type: String, required: true, trim: true},
    expiry_time: {type: String, required: true},
    use_case: {type: String, required: true},
  },
  {timestamps: true},
);

const OTPModel = mongoose.model('otps', OTPSchema);
module.exports = OTPModel;
