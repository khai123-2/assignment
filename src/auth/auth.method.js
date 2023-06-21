require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const accessToken = jwt.sign({ payload }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: 'HS256',
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });
  return accessToken;
};

const verifyToken = (accessToken, tokenSecret) => {
  try {
    const verifyData = jwt.verify(accessToken, tokenSecret);
    return { error: null, verifyData };
  } catch (error) {
    return { error, verifyData: {} };
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
