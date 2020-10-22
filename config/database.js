const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.DB_LOCAL_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    .then(con => {
      // promise returned
      console.log(`MongoDB Database connected with host: ${con.connection.host}`);
    });
};

module.exports = connectDb;
