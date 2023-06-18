const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('@/database/models/user.model');
const userController = require('@/controller/user.controller');
const { NotFoundError, ValidationError } = require('@/error/errorsException');
const authMethod = require('@/auth/auth.method');
describe('User Controller', () => {
  describe('login', () => {
    it('should return error if username does not exist', async () => {
      const req = {
        body: {
          username: 'nonexistentuser',
          password: 'password123',
        },
      };
      const res = sinon.stub();
      const next = sinon.stub();
      const userFinder = null;
      sinon.stub(User, 'findByPk').resolves(userFinder);
      await userController.login(req, res, next);
      sinon.assert.calledOnce(next);
      sinon.assert.calledOnceWithExactly(next, sinon.match.instanceOf(NotFoundError));
      sinon.restore();
    });

    it('should return error if password is invalid', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'wrongpassword',
        },
      };
      const res = sinon.stub();
      const next = sinon.stub();
      const user = {
        username: 'existinguser',
        password: await bcrypt.hash('password123', 10),
        employeeNumber: 15,
      };
      sinon.stub(User, 'findByPk').resolves(user);
      sinon.stub(bcrypt, 'compare').resolves(false);

      await userController.login(req, res, next);
      sinon.assert.calledOnce(next);
      sinon.assert.calledOnceWithExactly(next, sinon.match.instanceOf(ValidationError));

      sinon.restore();
    });

    it('should return access token on successful login', async () => {
      const req = {
        body: {
          username: 'existinguser',
          password: 'password123',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const user = {
        username: 'existinguser',
        password: await bcrypt.hash('password123', 10),
      };
      const next = sinon.stub();
      sinon.stub(User, 'findByPk').resolves(user);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(authMethod, 'generateToken').returns('fakeAccessToken');
      await userController.login(req, res, next);

      sinon.assert.calledOnceWithExactly(res.status, 200);
      sinon.assert.calledOnceWithExactly(res.send, {
        message: 'Login succeeded',
        username: 'existinguser',
        accessToken: 'fakeAccessToken',
      });
      sinon.restore();
    });
  });
});
