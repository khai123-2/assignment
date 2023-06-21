const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken } = require('@/auth/auth.method');

describe('Token Functions', () => {
  beforeEach(() => {
    sinon.stub(process, 'env').value({
      ACCESS_TOKEN_SECRET: 'your-access-token-secret',
      ACCESS_TOKEN_LIFE: '3600',
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateToken', () => {
    it('should generate a valid token', () => {
      const jwtSignStub = sinon.stub(jwt, 'sign').returns('dummy-token');

      const payload = { id: 1234, username: 'john' };
      const token = generateToken(payload);

      expect(token).to.equal('dummy-token');
      expect(jwtSignStub.calledOnce).to.be.true;
      expect(jwtSignStub.firstCall.args[0]).to.deep.equal({ payload });
      expect(jwtSignStub.firstCall.args[1]).to.equal('your-access-token-secret');
      expect(jwtSignStub.firstCall.args[2]).to.deep.equal({
        algorithm: 'HS256',
        expiresIn: '3600',
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const accessToken = 'dummy-token';
      const tokenSecret = 'your-access-token-secret';

      const jwtVerifyStub = sinon.stub(jwt, 'verify').returns({ id: 1234, username: 'john' });

      const result = verifyToken(accessToken, tokenSecret);

      expect(result.error).to.be.null;
      expect(result.verifyData).to.deep.equal({ id: 1234, username: 'john' });
      expect(jwtVerifyStub.calledOnce).to.be.true;
      expect(jwtVerifyStub.firstCall.args[0]).to.equal(accessToken);
      expect(jwtVerifyStub.firstCall.args[1]).to.equal(tokenSecret);
    });

    it('should handle invalid token', () => {
      const accessToken = 'invalid-token';
      const tokenSecret = 'your-access-token-secret';

      const jwtVerifyStub = sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));

      const result = verifyToken(accessToken, tokenSecret);

      expect(result.error).to.be.instanceOf(Error);
      expect(result.verifyData).to.deep.equal({});
      expect(jwtVerifyStub.calledOnce).to.be.true;
      expect(jwtVerifyStub.firstCall.args[0]).to.equal(accessToken);
      expect(jwtVerifyStub.firstCall.args[1]).to.equal(tokenSecret);
    });
  });
});
