const {mongodb, env} = require('./env');
const mongoose = require('mongoose');

/**
 * Connect to mongo db
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  return new Promise((resolve, reject) => {
    // print mongoose logs in dev env
    if (env === 'DEV') {
      mongoose.set('debug', true);
    }
    mongoose
      .connect(mongodb, {
        autoIndex: true,
      })
      .then(() => {
        console.log('DB Connected.');
        resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};
