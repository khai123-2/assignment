const User = require('@/database/models/user.model');
const bcrypt = require('bcrypt');
const authMethod = require('@/auth/auth.method');
const { NotFoundError, ValidationError } = require('@/error/errorsException');

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
      throw new NotFoundError('Username does not not exist');
    }
    const isPasswordValid = await bcrypt.compare(password, userFinder.password);
    if (!isPasswordValid) {
      throw new ValidationError('Password is not valid');
    }

    const dataForAccessToken = {
      username,
    };

    const accessToken = authMethod.generateToken(dataForAccessToken);
    if (!accessToken) {
      throw new Error('Login failed');
    }
    return res.status(200).send({
      message: 'Login succeeded',
      username,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  login,
};
