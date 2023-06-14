const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
describe('/first test', () => {
  it('should verify that we have 5 users in the DB', (done) => {
    chai
      .request(server)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data).be.an('array');
        expect(res.body.data.length).to.be.eql(5);
        done();
      });
  });
});
