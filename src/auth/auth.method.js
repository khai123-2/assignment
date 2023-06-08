require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  try {
    const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
      algorithm: 'HS256',
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    });
    return accessToken;
  } catch (err) {
    console.log(`Error in generate access token:  + ${err}`);
    return null;
  }
};

module.exports = {
  generateToken,
};
