const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} = require('@/controller/customer.controller');
const Customer = require('@/database/models/customer.model');
const Employee = require('@/database/models/employee.model');
const { NotFoundError, UnauthorizedError } = require('@/error/errorsException');

describe('Customer controller', () => {
  describe('getAllCustomers', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        user: {},
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return all customers when user role is not Staff or Leader', async () => {
      req.user.Role = { role: 'President' };
      const findAllStub = sinon.stub(Customer, 'findAll').resolves(['customer1', 'customer2']);

      await getAllCustomers(req, res, next);

      expect(findAllStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ data: ['customer1', 'customer2'] })).to.be.true;
    });

    it('should return customers for staff user', async () => {
      req.user.Role = { role: 'Staff' };
      req.user.employeeNumber = 123;

      const findAllStub = sinon.stub(Customer, 'findAll').resolves(['customer1', 'customer2']);

      await getAllCustomers(req, res, next);

      expect(findAllStub.calledOnce).to.be.true;
      expect(
        findAllStub.calledWithExactly({
          where: {
            salesRepEmployeeNumber: 123,
          },
        }),
      ).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ data: ['customer1', 'customer2'] })).to.be.true;
    });

    it('should return customers for leader user', async () => {
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';

      const findAllStub = sinon.stub(Customer, 'findAll').resolves(['customer1', 'customer2']);

      await getAllCustomers(req, res, next);

      expect(findAllStub.calledOnce).to.be.true;
      expect(
        findAllStub.calledWithExactly({
          include: {
            model: Employee,
            where: {
              officeCode: 'office123',
            },
            attributes: [],
          },
        }),
      ).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ data: ['customer1', 'customer2'] })).to.be.true;
    });

    it('should call the error handler when an error occurs', async () => {
      req.user.Role = { role: 'President' };
      const error = new Error('Something went wrong');
      const findAllStub = sinon.stub(Customer, 'findAll').rejects(error);

      await getAllCustomers(req, res, next);

      expect(findAllStub.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });
  describe('getCustomerById', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
        user: {
          Role: {},
          employeeNumber: 123,
          officeCode: 'office123',
        },
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should get customer by id for Staff user when customer belongs to the employee', async () => {
      req.params.id = 456;
      req.user.Role.role = 'Staff';

      const findOneStub = sinon.stub(Customer, 'findOne').resolves('customer1');

      await getCustomerById(req, res, next);

      expect(findOneStub.calledOnce).to.be.true;
      expect(
        findOneStub.calledWithExactly({
          where: {
            customerNumber: 456,
            salesRepEmployeeNumber: 123,
          },
        }),
      ).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ data: 'customer1' })).to.be.true;
    });

    it('should get customer by id for Leader user when customer belongs to the same office', async () => {
      req.params.id = 456;
      req.user.Role.role = 'Leader';

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');

      await getCustomerById(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(
        findByPkStub.calledWithExactly(456, {
          include: {
            model: Employee,
            where: {
              officeCode: 'office123',
            },
          },
        }),
      ).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ data: 'customer1' })).to.be.true;
    });

    it('should get customer by id for other roles', async () => {
      req.params.id = 456;
      req.user.Role.role = 'President';

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');

      await getCustomerById(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(456)).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ data: 'customer1' })).to.be.true;
    });

    it('should throw NotFoundError when customer does not exist', async () => {
      req.params.id = 456;
      req.user.Role.role = 'President';

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(null);

      await getCustomerById(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(456)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
      expect(next.args[0][0].message).to.equal('Customer not found');
    });
  });
  describe('createCustomer', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        user: {},
        body: {},
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should create customer when user role is not Staff or Leader', async () => {
      req.user.Role = { role: 'President' };
      const customer = {
        customerNumber: 15,
        customerName: 'Michael',
        contactLastName: 'Jackson',
        contactFirstName: 'Michael ',
        phone: '030-007-43219',
        addressLine1: 'Gary, Indiana',
        addressLine2: null,
        city: 'California',
        state: null,
        postalCode: null,
        country: 'America',
        salesRepEmployeeNumber: 3,
        creditLimit: null,
      };
      req.body = customer;

      const createStub = sinon.stub(Customer, 'create').resolves(customer);

      await createCustomer(req, res, next);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledWithExactly(customer)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was created', data: customer })).to.be.true;
    });

    it('should create customer for leader user when employee exists in the same office', async () => {
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';
      const customer = {
        customerNumber: 15,
        customerName: 'Michael',
        contactLastName: 'Jackson',
        contactFirstName: 'Michael ',
        phone: '030-007-43219',
        addressLine1: 'Gary, Indiana',
        addressLine2: null,
        city: 'California',
        state: null,
        postalCode: null,
        country: 'America',
        salesRepEmployeeNumber: 3,
        creditLimit: null,
      };
      req.body = customer;

      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves({ officeCode: 'office123' });
      const createStub = sinon.stub(Customer, 'create').resolves(customer);

      await createCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(3)).to.be.true;
      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledWithExactly(customer)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was created', data: customer })).to.be.true;
    });

    it('should throw NotFoundError when employee does not exist for leader user', async () => {
      req.user.Role = { role: 'Leader' };
      req.body = { customerName: 'Michael', salesRepEmployeeNumber: 15 };

      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves(null);

      await createCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(15)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
      expect(next.args[0][0].message).to.equal('Employee not found');
    });

    it('should throw Error when employee is not from the same office for leader user', async () => {
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';
      req.body = { customerName: 'Michael', salesRepEmployeeNumber: 4 };

      const findByPkStub = sinon.stub(Employee, 'findByPk').resolves({ officeCode: 'office456' });

      await createCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(4)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(UnauthorizedError);
      expect(next.args[0][0].message).to.equal('Employee is not from the same office');
    });

    it('should throw Error when customer does not belong to the employee for staff user', async () => {
      req.user.Role = { role: 'Staff' };
      req.user.employeeNumber = 3;
      req.body = { customerName: 'Michael', salesRepEmployeeNumber: 4 };

      await createCustomer(req, res, next);

      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(UnauthorizedError);
      expect(next.args[0][0].message).to.equal('Customer does not belong to the employee');
    });
    it('should create customer for staff user when customer belongs to the employee', async () => {
      req.user.Role = { role: 'Staff' };
      req.user.employeeNumber = 3;
      const customer = {
        customerNumber: 15,
        customerName: 'Michael',
        contactLastName: 'Jackson',
        contactFirstName: 'Michael ',
        phone: '030-007-43219',
        addressLine1: 'Gary, Indiana',
        addressLine2: null,
        city: 'California',
        state: null,
        postalCode: null,
        country: 'America',
        salesRepEmployeeNumber: 3,
        creditLimit: null,
      };
      req.body = customer;

      const createStub = sinon.stub(Customer, 'create').resolves(customer);

      await createCustomer(req, res, next);

      expect(createStub.calledOnce).to.be.true;
      expect(createStub.calledWithExactly(customer)).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was created', data: customer })).to.be.true;
    });

    it('should call the error handler when an error occurs', async () => {
      req.user.Role = { role: 'President' };
      req.body = { name: 'John Doe' };

      const error = new Error('Something went wrong');
      const createStub = sinon.stub(Customer, 'create').rejects(error);

      await createCustomer(req, res, next);

      expect(createStub.calledOnce).to.be.true;
      expect(next.calledWith(error)).to.be.true;
    });
  });

  describe('deleteCustomer', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
        user: {},
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should delete customer when it exists and user role is not Leader', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'President' };

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');
      const destroyStub = sinon.stub().resolves();

      // Stub the destroy method on the customer object
      const customerStub = { destroy: destroyStub };
      findByPkStub.returns(customerStub);

      await deleteCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(destroyStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was deleted' })).to.be.true;
    });

    it('should delete customer for leader user when customer exists and belongs to the same office employee', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');
      const findByPkEmployeeStub = sinon.stub(Employee, 'findByPk').resolves({ officeCode: 'office123' });
      const destroyStub = sinon.stub().resolves();

      // Stub the destroy method on the customer object
      const customerStub = { destroy: destroyStub, salesRepEmployeeNumber: 456 };
      findByPkStub.returns(customerStub);

      await deleteCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(findByPkEmployeeStub.calledOnce).to.be.true;
      expect(findByPkEmployeeStub.calledWithExactly(456)).to.be.true;
      expect(destroyStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was deleted' })).to.be.true;
    });

    it('should throw NotFoundError when customer does not exist', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'President' };
      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(null);

      await deleteCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
      expect(next.args[0][0].message).to.equal('Customer not found');
    });

    it('should throw Error when customer belongs to a different office employee for leader user', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');
      const findByPkEmployeeStub = sinon.stub(Employee, 'findByPk').resolves({ officeCode: 'office456' });

      // Stub the destroy method on the customer object
      const customerStub = { salesRepEmployeeNumber: 456 };
      findByPkStub.returns(customerStub);

      await deleteCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(findByPkEmployeeStub.calledOnce).to.be.true;
      expect(findByPkEmployeeStub.calledWithExactly(456)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(UnauthorizedError);
      expect(next.args[0][0].message).to.equal("Customer is not from the same office's employee");
    });
  });

  describe('updateCustomer', () => {
    let req, res, next;

    beforeEach(() => {
      req = {
        params: {},
        user: {},
        body: {},
      };
      res = {
        status: sinon.stub().returnsThis(),
        send: sinon.stub(),
      };
      next = sinon.stub();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should update customer when it exists and user role is not Leader', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'President' };
      req.body = { customerName: 'Updated Customer' };

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');
      const saveStub = sinon.stub().resolves();

      // Stub the save method on the customer object
      const customerStub = { set: sinon.stub(), save: saveStub };
      findByPkStub.returns(customerStub);

      await updateCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(customerStub.set.calledOnce).to.be.true;
      expect(customerStub.set.calledWithExactly({ customerName: 'Updated Customer' })).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was updated', data: customerStub })).to.be.true;
    });

    it('should update customer for leader user when customer exists and belongs to the same office employee', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';
      req.body = { customerName: 'Updated Customer' };

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');
      const findByPkEmployeeStub = sinon.stub(Employee, 'findByPk').resolves({ officeCode: 'office123' });
      const saveStub = sinon.stub().resolves();

      // Stub the save method on the customer object
      const customerStub = { set: sinon.stub(), save: saveStub, salesRepEmployeeNumber: 456 };
      findByPkStub.returns(customerStub);

      await updateCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(findByPkEmployeeStub.calledOnce).to.be.true;
      expect(findByPkEmployeeStub.calledWithExactly(456)).to.be.true;
      expect(customerStub.set.calledOnce).to.be.true;
      expect(customerStub.set.calledWithExactly({ customerName: 'Updated Customer' })).to.be.true;
      expect(saveStub.calledOnce).to.be.true;
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.send.calledWith({ message: 'Customer was updated', data: customerStub })).to.be.true;
    });

    it('should throw NotFoundError when customer does not exist', async () => {
      req.params.id = 123;
      req.body = { customerName: 'Updated Customer' };
      req.user.Role = { role: 'President' };

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves(null);

      await updateCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(NotFoundError);
      expect(next.args[0][0].message).to.equal('Customer not found');
    });

    it('should throw Error when customer belongs to a different office employee for leader user', async () => {
      req.params.id = 123;
      req.user.Role = { role: 'Leader' };
      req.user.officeCode = 'office123';
      req.body = { customerName: 'Updated Customer' };

      const findByPkStub = sinon.stub(Customer, 'findByPk').resolves('customer1');
      const findByPkEmployeeStub = sinon.stub(Employee, 'findByPk').resolves({ officeCode: 'office456' });

      // Stub the save method on the customer object
      const customerStub = { salesRepEmployeeNumber: 456 };
      findByPkStub.returns(customerStub);

      await updateCustomer(req, res, next);

      expect(findByPkStub.calledOnce).to.be.true;
      expect(findByPkStub.calledWithExactly(123)).to.be.true;
      expect(findByPkEmployeeStub.calledOnce).to.be.true;
      expect(findByPkEmployeeStub.calledWithExactly(456)).to.be.true;
      expect(next.calledOnce).to.be.true;
      expect(next.args[0][0]).to.be.instanceOf(UnauthorizedError);
      expect(next.args[0][0].message).to.equal("Customer is not from the same office's employee");
    });
  });
});
