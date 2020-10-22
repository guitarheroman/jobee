// Create and send token and save in httpOnly cookie
const sendToken = (user, statusCode, res) => {
  console.log(user);
  // create jwt token
  const token = user.getJwtToken(); // get method in user model

  //options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000), //hours, mins, seconds, ms
    httpOnly: true
  };

  // set secure in cookies when in https
  // if(process.env.NODE_ENV === 'production'){
  //   options.secure = true;
  // }

  // respond with token and set inside cookie
  res
    .status(statusCode)
    .cookie("token", token, options) // name, token value, options
    .json({
      success: true,
      token,
      data: user
    });
};

module.exports = sendToken;
