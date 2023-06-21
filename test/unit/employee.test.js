const sinon = require('sinon');
const employeeController = require('@/controller/employee.controller');
const { expect } = require('chai');
const Employee = require('@/database/models/employee.model');
const { NotFoundError } = require('@/error/errorsException');

describe('Employee Controller', () => {
  describe('Get all employees', () => {
    it('should return all employees', async () => {
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const req = sinon.stub();
      const next = sinon.stub();
      const employees = [
        {
          employeeNumber: 1,
          lastName: 'Doe',
          firstName: 'John',
          extension: 'x1234',
          email: 'johndoe@company.com',
          officeCode: '1',
          reportsTo: null,
          jobTitle: 'CEO',
          roleId: 1,
          createdAt: '2023-06-13T09:42:51.000Z',
          updatedAt: '2023-06-13T09:42:51.000Z',
        },
      ];
      const getStub = sinon.stub(Employee, 'findAll').resolves(employees);
      await employeeController.getAllEmployees(req, res, next);

      expect(getStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.send.calledWith({
          data: employees,
        }),
      ).to.be.true;
      sinon.restore();
    });
  });
  describe('get employee by id', () => {
    it('should return the employee with the specified ID', async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const next = sinon.stub();
      const employee = {
        employeeNumber: 1,
        lastName: 'Doe',
        firstName: 'John',
        extension: 'x1234',
        email: 'johndoe@company.com',
        officeCode: '1',
        reportsTo: null,
        jobTitle: 'CEO',
        roleId: 1,
      };
      const getStub = sinon.stub(Employee, 'findByPk').resolves(employee);
      await employeeController.getEmployeeById(req, res, next);

      expect(getStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.send.calledWith({
          data: employee,
        }),
      ).to.be.true;
      sinon.restore();
    });
    it('should throw a NotFoundError if the employee is not found', async () => {
      const req = {
        params: {
          id: 1,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      sinon.stub(Employee, 'findByPk').resolves(null);
      const next = sinon.stub();
      await employeeController.getEmployeeById(req, res, next);
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
      expect(next.args[0][0].message).to.equal('Employee not found');
      sinon.restore();
    });
  });

  describe('create a new employee', () => {
    it('should return employee on successful create', async () => {
      const req = {
        body: {
          employeeNumber: 15,
          lastName: 'Alex',
          firstName: 'Hunter',
          extension: 'x6677',
          email: 'alexhuntergmail.com',
          officeCode: '1',
          reportsTo: 2,
          jobTitle: 'Staff',
          roleId: 4,
        },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const employee = {
        employeeNumber: 15,
        lastName: 'Alex',
        firstName: 'Hunter',
        extension: 'x6677',
        email: 'alexhuntergmail.com',
        officeCode: '1',
        reportsTo: 2,
        jobTitle: 'Staff',
        roleId: 4,
      };
      const next = sinon.stub();
      const createStub = sinon.stub(Employee, 'create').resolves(employee);
      await employeeController.createEmployee(req, res, next);

      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.send.calledWith({
          message: 'Employee was created',
          data: employee,
        }),
      ).to.be.true;
      sinon.restore();
    });
  });

  describe('Delete an employee', () => {
    describe('DeleteEmployee', () => {
      it('should delete the employee with the specified ID', async () => {
        const req = {
          params: {
            id: 1,
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub(),
        };
        const employeeFinder = {
          id: 1,
          name: 'John Doe',
          destroy: sinon.stub(),
        };
        sinon.stub(Employee, 'findByPk').resolves(employeeFinder);

        await employeeController.DeleteEmployee(req, res, null);

        expect(Employee.findByPk.calledOnceWithExactly(1)).to.be.true;
        expect(employeeFinder.destroy.calledOnce).to.be.true;
        expect(res.status.calledWith(200)).to.be.true;
        expect(res.send.calledWithExactly({ message: 'Employee was deleted' })).to.be.true;

        sinon.restore();
      });

      it('should throw a NotFoundError if the employee is not found', async () => {
        const req = {
          params: {
            id: 1,
          },
        };
        const res = {
          status: sinon.stub().returnsThis(),
          send: sinon.stub(),
        };
        sinon.stub(Employee, 'findByPk').resolves(null);
        const next = sinon.stub();

        await employeeController.DeleteEmployee(req, res, next);

        expect(Employee.findByPk.calledOnceWithExactly(1)).to.be.true;
        const [error] = next.firstCall.args;
        expect(error).to.be.an.instanceOf(NotFoundError);
        sinon.restore();
      });
    });
  });
  describe('updateEmployee', () => {
    it('should update an existing employee and return a success message', async () => {
      const req = {
        params: { id: '1' },
        body: { name: 'John Doe', email: 'johndoe@example.com' },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const next = sinon.stub();
      const employeeFinder = {
        set: sinon.stub(),
        save: sinon.stub(),
      };
      sinon.stub(Employee, 'findByPk').returns(employeeFinder);

      await employeeController.updateEmployee(req, res, next);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.args[0][0]).to.have.property('message', 'Employee was updated');
      expect(res.send.args[0][0]).to.have.property('data', employeeFinder);
      expect(employeeFinder.set.calledWith(req.body)).to.be.true;
      expect(employeeFinder.save.calledOnce).to.be.true;

      sinon.restore();
    });

    it('should handle employee not found', async () => {
      const employeeId = 123;
      const req = { params: { id: employeeId }, body: { name: 'John Doe' } };
      const res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      const next = sinon.stub();

      const employeeFinderStub = sinon.stub(Employee, 'findByPk').resolves(null);

      await employeeController.updateEmployee(req, res, next);

      expect(employeeFinderStub.calledOnceWithExactly(employeeId)).to.be.true;
      const [error] = next.firstCall.args;
      expect(error).to.be.an.instanceOf(NotFoundError);
      sinon.restore();
    });
  });
});
