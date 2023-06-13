const User = require('@/database/models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('@/auth/auth.method');
const getAllUsers = async (_req, res, next) => {
  try {
    const users = await User.findAll();
    return res.status(200).send({ data: users });
  } catch (err) {
    next(err);
  }
};
const registerUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).send({ message: 'User was created', data: user });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const userFinder = await User.findByPk(username);
    if (!userFinder) {
      return res.status(401).json({ message: 'Username is not exist' });
    }
    const isPasswordValid = await bcrypt.compare(password, userFinder.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Password is not valid' });
    }

    const dataForAccessToken = {
      username: userFinder.username,
    };

    const accessToken = generateToken(dataForAccessToken);
    if (!accessToken) {
      return res.status(401).json({ msg: 'Login failed' });
    }
    return res.status(200).send({
      message: 'Login succeeded',
      username: userFinder.username,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  login,
  getAllUsers,
};
