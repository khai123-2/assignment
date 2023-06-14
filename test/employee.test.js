const chai = require('chai');
const expect = chai.expect;
const server = require('../server');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Employee API', () => {
  let accessToken;
  let employeeNumber;
  before((done) => {
    chai
      .request(server)
      .post('/api/users/login')
      .send({
        username: 'johndoe',
        password: '123456A#',
      })
      .end((err, res) => {
        accessToken = res.body.accessToken;
        done();
      });
  });

  describe('POST /api/employees', () => {
    it('should create a new employee with a valid access token', (done) => {
      const newEmployee = {
        employeeNumber: 15,
        lastName: 'Alex',
        firstName: 'Hunter',
        extension: 'x6677',
        email: 'alexhunter@gmail.com',
        officeCode: '1',
        reportsTo: 5,
        jobTitle: 'Staff',
        roleId: 4,
      };

      chai
        .request(server)
        .post('/api/employees')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newEmployee)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('employeeNumber', 15);
          expect(res.body.data).to.have.property('lastName', 'Alex');
          // Store the created employee ID for later use
          employeeNumber = res.body.data.employeeNumber;
          done();
        });
    });
  });
  describe('GET /api/employees/:id', () => {
    it('should get the created employee by ID', (done) => {
      chai
        .request(server)
        .get(`/api/employees/${employeeNumber}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('employeeNumber', employeeNumber);
          done();
        });
    });
  });
  describe('PUT /api/employees/:id', () => {
    it('should update an employee with a valid access token', (done) => {
      const updatedEmployee = {
        lastName: 'Alex',
        firstName: 'Hunter',
        extension: 'x6677',
        email: 'alexhunter2@gmail.com',
        officeCode: '1',
        reportsTo: 5,
        jobTitle: 'Staff',
        roleId: 4,
      };

      chai
        .request(server)
        .put(`/api/employees/${employeeNumber}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedEmployee)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('email', 'alexhunter2@gmail.com');
          expect(res.body.data).to.have.property('reportsTo', 5);
          done();
        });
    });
  });
  describe('DELETE /api/employees/:id', () => {
    it('should delete the created employee by ID', (done) => {
      chai
        .request(server)
        .delete(`/api/employees/${employeeNumber}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message', 'Employee was deleted');
          done();
        });
    });
  });
});
