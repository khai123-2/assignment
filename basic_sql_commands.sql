/*----Write CRUD commands for employees table*/
/*Create*/
INSERT INTO employees (lastName, firstName, extension, email, officeCode, reportsTo, jobTitle, roleId, createdAt, updatedAt)
VALUES ('Smith', 'John', 'ext123', 'johnsmith@example.com', '124', 1, 'Manager', 2, '2023-06-21 09:00:00', '2023-06-21 09:00:00');
/*Read*/
SELECT * FROM employees;
/*Update*/
UPDATE employees
SET lastName = 'Johnson', firstName = 'Robert', extension = 'ext456', email = 'robertjohnson@example.com',
    officeCode = '125', reportsTo = 2, jobTitle = 'Supervisor', roleId = 3, updatedAt = '2023-06-21 10:00:00'
WHERE employeeNumber = 1;
/*Delete*/
DELETE FROM employees WHERE employeeNumber = 1;

/*----Report list of employee order by number of customers*/
SELECT e.employeeNumber, e.lastName, e.firstName, COUNT(c.customerNumber) AS customerCount
FROM employees e
LEFT JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
GROUP BY e.employeeNumber, e.lastName, e.firstName
ORDER BY customerCount DESC;

/*----Report list of offices order by number of customers*/
SELECT o.officeCode, o.city, o.country, COUNT(c.customerNumber) AS customerCount
FROM offices o
LEFT JOIN employees e ON o.officeCode = e.officeCode
LEFT JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
GROUP BY o.officeCode, o.city, o.country
ORDER BY customerCount DESC;

/*----Report list of employee order by total credit limit of their customers*/
SELECT e.employeeNumber, e.lastName, e.firstName, SUM(c.creditLimit) AS totalCreditLimit
FROM employees e
JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
GROUP BY e.employeeNumber, e.lastName, e.firstName
ORDER BY totalCreditLimit DESC;

/*----Report average customer’s credit limit of each office*/
SELECT o.officeCode, o.city, o.country, AVG(c.creditLimit) AS averageCreditLimit
FROM offices o
JOIN employees e ON o.officeCode = e.officeCode
JOIN customers c ON e.employeeNumber = c.salesRepEmployeeNumber
GROUP BY o.officeCode, o.city, o.country
