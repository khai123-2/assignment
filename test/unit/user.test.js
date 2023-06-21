const sinon = require('sinon');
const bcrypt = require('bcrypt');
const User = require('@/database/models/user.model');
const { expect } = require('chai');
const userController = require('@/controller/user.controller');
const { NotFoundError, ValidationError } = require('@/error/errorsException');
const authMethod = require('@/auth/auth.method');
const Employee = require('@/database/models/employee.model');
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
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
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
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(ValidationError);
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
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.send.calledWith({
          message: 'Login succeeded',
          username: 'existinguser',
          accessToken: 'fakeAccessToken',
        }),
      ).to.be.true;
      sinon.restore();
    });
  });
  describe('registerUser', () => {
    it('should throw a NotFoundError if the employee is not found', async () => {
      const req = {
        body: {
          employeeNumber: 123,
          password: 'password123',
          username: 'john_doe',
        },
      };
      const res = {};
      const next = sinon.stub();

      await userController.registerUser(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
      expect(next.args[0][0].message).to.equal('Employee not found');
      sinon.restore();
    });
    it('should throw an Error if the username already exists', async () => {
      const req = {
        body: {
          employeeNumber: 123,
          password: 'password123',
          username: 'john_doe',
        },
      };
      const res = {};
      const next = sinon.stub();

      sinon.stub(Employee, 'findByPk').resolves({});
      sinon.stub(User, 'findByPk').resolves({});

      await userController.registerUser(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal('Username already exists');

      sinon.restore();
    });

    it('should throw an Error if the user account has already been created', async () => {
      const req = {
        body: {
          employeeNumber: 123,
          password: 'password123',
          username: 'john_doe',
        },
      };
      const res = {};
      const next = sinon.stub();

      sinon.stub(Employee, 'findByPk').resolves({});
      sinon.stub(User, 'findByPk').resolves(null);
      sinon.stub(User, 'findOne').resolves({});

      await userController.registerUser(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(Error);
      expect(next.args[0][0].message).to.equal('User have been created');

      sinon.restore();
    });

    it('should create a new user if all checks pass', async () => {
      const req = {
        body: {
          employeeNumber: 123,
          password: 'password123',
          username: 'john_doe',
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const user = {
        username: 'john_doe',
        password: await bcrypt.hash('password123', 10),
        employeeNumber: 123,
      };
      const next = sinon.stub();

      sinon.stub(Employee, 'findByPk').resolves({});
      sinon.stub(User, 'findByPk').resolves(null);
      sinon.stub(User, 'findOne').resolves(null);
      const createStub = sinon.stub(User, 'create').resolves(user);

      await userController.registerUser(req, res, next);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith({ message: 'User was created', data: user })).to.be.true;
      sinon.restore();
    });
  });
});
