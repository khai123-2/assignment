const User = require('../models/user.model');
const userSchema = require('../schemas/user.schema');
const bcrypt = require('bcrypt');
const { generateToken } = require('../auth/auth.method');

const getAllUsers = async (_req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).send({ data: users });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const registerUser = async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const user = await User.create(value);
    return res.status(201).send({ message: 'User was created', data: user });
  } catch (err) {
    if (err.name) {
      return res.status(500).json({ err });
    } else {
      return res.status(500).json({ error: err.message });
    }
  }
};

const login = async (req, res) => {
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
    return res.status(500).json({ err: err.message });
  }
};

module.exports = {
  registerUser,
  login,
  getAllUsers,
};
