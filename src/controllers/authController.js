const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  Handle500Error,
  Handle200Response,
  Handle400Error,
} = require('../helpers');
const { env } = require('../config');
const { ValidateMobile, ValidateEmail, FindOne, Insert } = require('./baseController');
const { User } = require('../models');

module.exports = {
  registerUser: async (req, res, next) => {
    try {

      const { email, password, mobile, name, gender } = req.body;
      if (!email || !password || !mobile || !name || !gender) {
        return Handle400Error(res, 'Please provide all required user details');
      }

      if (!ValidateEmail(email)) return Handle400Error(res, 'Please enter a valid email');
      if (!ValidateMobile(mobile)) return Handle400Error(res, 'Please enter a valid phone number');
      const userExists = await FindOne({
        model: User,
        where: { email: email }
      })
      if (userExists)
        return Handle400Error(res, 'Email already exists');
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await Insert({
        model: User,
        data: { email, password: hashedPassword, mobile, name, gender }
      });
      if (!newUser) {
        return Handle400Error(res, "Failed to register please try again");
      }
      return Handle200Response(res, {
        message: 'User registered successfully',
        data: newUser
      });
    } catch (error) {
      Handle500Error(error, req, res, next);
    }
  },
  loginUser: async (req, res, next) => {
    try {

      const { email, password } = req.body;
      if (!email || !password) {
        return Handle400Error(res, 'Please provide email and password');
      }
      const user = await FindOne({
        model: User,
        where: { email: email }
      });
      if (!user) {
        return Handle400Error(res, 'Invalid email or password');
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return Handle400Error(res, 'Invalid email or password');
      }
      const token = jwt.sign({ id: user._id }, env.secret, { expiresIn: env.token_expiry_limit });
      return Handle200Response(res, {
        message: 'User logged in successfully',
        data: { ...user,token }
      });

    } catch (error) {
      Handle500Error(error, req, res, next);
    }
  }
}
