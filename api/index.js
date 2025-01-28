const { env, mongoose, app } = require('./config');

/**
 * Connect Mongoose and start server
 */

mongoose
  .connect(env.mongodb)
  .then(() => {
    app.listen(env.port, () => {
      console.log(
        `Server started on port ${env.port} (${env.env})`
      );
    });
  })
  .catch(e => {
    console.log('Invalid database connection...!');
  });
