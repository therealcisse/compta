/**
 *  Copyright (c) 2015, Epsilon, SARL.
 *  All rights reserved.
 *
 */

import Parse from 'parse';

import Account from '../Account';
import Company from '../Company';
import Transaction from '../Transaction';
import Operation from '../Operation';
import Bank from '../Bank';
import Customer from './Customer';
import Employee from './Employee';
import Vendor from './Vendor';

import Product from '../Product';

import Expense from './Expense';
import Sale from './Sale';
import Invoice from './Invoice';
import Bill from './Bill';
import PaymentOfInvoices from './PaymentOfInvoices';
import PaymentOfBills from './PaymentOfBills';

import InvoiceItem from '../InvoiceItem';
import PaymentOfInvoicesItem from '../PaymentOfInvoicesItem';
import PaymentOfBillsItem from '../PaymentOfBillsItem';

import ExpenseItem from '../ExpenseItem';
import BillItem from '../BillItem';

import SaleItem from '../SaleItem';

import concat from 'lodash.concat';
import map from 'lodash.map';
import compact from 'lodash.compact';
import group from 'lodash.groupby';

import chartOfAccounts from '../accounts.json';

import moment from 'moment';

import { DEFAULT_RECENT_DAYS, } from '../constants';

import { parseIDLoader, parseTableLoader, parseTableCountLoader, } from '../loaders';

export function getViewer() {
  return Parse.User.current();
}

export function getUser(id) {
  return parseIDLoader.load([Parse.User, id]);
}

export function getProduct(info) { return getTypeById(Product, info); }

export function getBank(info) { return getTypeById(Bank, info); }
export function getEmployee(info) { return getTypeById(Employee, info); }
export function getCustomer(info) { return getTypeById(Customer, info); }
export function getVendor(info) { return getTypeById(Vendor, info); }
export function getExpense(info) { return getTypeById(Expense, info); }
export function getSale(info) { return getTypeById(Sale, info); }
export function getInvoice(info) { return getTypeById(Invoice, info); }
export function getBill(info) { return getTypeById(Bill, info); }
export function getPaymentOfInvoices(info) { return getTypeById(PaymentPaymentOfInvoices, info); }
export function getPaymentOfBills(info) { return getTypeById(PaymentPaymentOfBills, info); }

export function getInvoiceItem(info) { return getTypeById(InvoiceItem, info); }
export function getPaymentOfInvoicesItem(info) { return getTypeById(PaymentOfInvoicesItem, info); }
export function getPaymentOfBillsItem(info) { return getTypeById(PaymentOfBillsItem, info); }

export function getExpenseItem(info) { return getTypeById(ExpenseItem, info); }
export function getBillItem(info) { return getTypeById(BillItem, info); }
export function getSaleItem(info) { return getTypeById(SaleItem, info); }

export function getTransaction(info) {
  return getTypeById(Transaction, info);
}

export function getCompany(id) {
  return parseIDLoader.load([Company, id]);
}

export function getCompanies() {
  return parseTableLoader.load(Company);
}

export function getCompanyProducts(company) {
  return parseTableLoader.load(Product({id: company.id}));
}

export function getBankAccounts() {

  return [
    { ...chartOfAccounts['5.1.6.1.1'], icon: 'attach_money', __type: 'Bank', },
    { ...chartOfAccounts['5.1.4.1'], icon: 'account_balance', __type: 'Bank', },
  ];
}

export function getOperation(info) {
  return getTypeById(Operation, info);
}

export function getOperationsByCategories({ companyId, from, to, type, categories, }) {
  const qry = new Parse.Query(Operation({ id: companyId, }));

  if(process.env.NODE_ENV !== 'production'){
    console.assert(Array.isArray(categories, 'categories should be an array'));
  }

  qry.containedIn('categoryCode', categories);
  if(type){
    qry.equalTo('type', type);
  }
  if(from){
    qry.greaterThanOrEqualTo('date', new Date(from));
  }
  if(to){
    qry.lessThanOrEqualTo('date', new Date(to));
  }
  qry.ascending('date');
  qry.limit(100000);
  return qry.find();
}

export function getAccount(info) {
  return getTypeById(Account, info);
}

export function getCompanyAccounts(company) {
  return parseTableLoader.load(Account({id: company.id}));
}

export function getTransactions(company) {
  return parseTableLoader.load(Transaction({id: company.id}));
}

export function getTransactionOperations({ companyId, id, }) {
  const qry = new Parse.Query(Operation({ id: companyId, }));
  qry.equalTo('transaction', Transaction({ id: companyId, }).createWithoutData(id));
  qry.limit(100000);
  return qry.find();
}

export function getTransactionByType({ type, companyId, id, }) {
  const qry = new Parse.Query(Transaction({ id: companyId, }));
  qry.equalTo('transactionType', type);

  switch(type){
    case 'Invoice':           qry.equalTo('invoice', Invoice({ id: companyId, }).createWithoutData(id)); break;
    case 'Sale':              qry.equalTo('sale', Sale({ id: companyId, }).createWithoutData(id)); break;
    case 'PaymentOfInvoices': qry.equalTo('paymentOfInvoices', PaymentOfInvoices({ id: companyId, }).createWithoutData(id)); break;

    case 'Bill':           qry.equalTo('bill', Bill({ id: companyId, }).createWithoutData(id)); break;
    case 'Expense':        qry.equalTo('expense', Expense({ id: companyId, }).createWithoutData(id)); break;
    case 'PaymentOfBills': qry.equalTo('paymentOfBills', PaymentOfBills({ id: companyId, }).createWithoutData(id)); break;
  }

  return qry.first();
}

export function getCompanyExpenses(company) {
  return parseTableLoader.load(Expense({id: company.id}));
}
export function getCompanySales(company) {
  return parseTableLoader.load(Sale({id: company.id}));
}
export function getCompanyInvoices(company) {
  return parseTableLoader.load(Invoice({id: company.id}));
}
export function getCompanyInvoicesTotalCount(company) {
  return countByType(Invoice({id: company.id}));
}
export function getCompanyBills(company) {
  return parseTableLoader.load(Bill({id: company.id}));
}
export function getCompanyBillsTotalCount(company) {
  return countByType(Bill({id: company.id}));
}
export function getCompanyPaymentsOfInvoices(company) {
  return parseTableLoader.load(PaymentOfInvoices({id: company.id}));
}
export function getCompanyPaymentsOfBills(company) {
  return parseTableLoader.load(PaymentOfBills({id: company.id}));
}

export function getInvoiceItems(invoice) {
  const qry = new Parse.Query(InvoiceItem({id: invoice.get('company').id}));
  qry.equalTo('invoice', Parse.Object.extend('Invoice_' + invoice.get('company').id).createWithoutData(invoice.id));
  qry.include([ 'invoice', 'item' ]);
  qry.ascending('index');
  return qry.find();
}
export function getBillItems(bill) {
  const qry = new Parse.Query(BillItem({id: bill.get('company').id}));
  qry.equalTo('bill', Parse.Object.extend('Bill_' + bill.get('company').id).createWithoutData(bill.id));
  qry.include([ 'bill' ]);
  qry.ascending('index');
  return qry.find();
}

export function getAccountsByCategories(categories) {
  return Object.keys(chartOfAccounts).reduce(function (accounts, code) {
    const account = chartOfAccounts[code];
    (categories.indexOf(account._categoryCode) !== -1) && accounts.push(account);
    return accounts;
  }, []);
}

export function getInvoicePayments(invoice) {
  const qry = new Parse.Query(PaymentOfInvoicesItem({id: invoice.get('company').id}));
  qry.equalTo('invoice', Parse.Object.extend('Invoice_' + invoice.get('company').id).createWithoutData(invoice.id));
  qry.include(['payment', 'invoice']);
  qry.descending('date');
  return qry.find();
}
export function getPaymentOfInvoicesItems(payment) {
  const qry = new Parse.Query(PaymentOfInvoicesItem({id: payment.get('company').id}));
  qry.equalTo('payment', Parse.Object.extend('PaymentOfInvoices_' + payment.get('company').id).createWithoutData(payment.id));
  qry.include(['payment', 'invoice']);
  return qry.find();
}
export function getBillPayments(bill) {
  console.assert(bill.get('company').id);
  const qry = new Parse.Query(PaymentOfBillsItem({id: bill.get('company').id}));
  qry.equalTo('bill', Parse.Object.extend('Bill_' + bill.get('company').id).createWithoutData(bill.id));
  qry.include(['payment', 'bill']);
  qry.descending('date');
  return qry.find();
}
export function getPaymentOfBillsItems(payment) {
  const qry = new Parse.Query(PaymentOfBillsItem({id: payment.get('company').id}));
  qry.equalTo('payment', Parse.Object.extend('PaymentOfBills_' + payment.get('company').id).createWithoutData(payment.id));
  qry.include(['payment', 'bill']);
  return qry.find();
}

export function getCompanyPeople(company) {
  // return Parse.Promise.when([
  //   getCompanyVendors(company),
  //   getCompanyCustomers(company),
  //   getCompanyEmployees(company),
  // ]).then(([ vendors, customers, employees ]) => concat(vendors, customers, employees));

  return parseTableLoader.load(
    Parse.Object.extend('People_' + company.id));
}

export function getCompanyVendors(company) {
  const qry = new Parse.Query(Vendor({id: company.id}));
  qry.equalTo('type', 'Vendor');
  return qry.find();

  // return parseTableLoader.load(Vendor({id: company.id}));
}

export function getCompanyCustomers(company) {
  const qry = new Parse.Query(Vendor({id: company.id}));
  qry.equalTo('type', 'Customer');
  return qry.find();

  // return parseTableLoader.load(Customer({id: company.id}));
}

export function getCompanyEmployees(company) {
  const qry = new Parse.Query(Vendor({id: company.id}));
  qry.equalTo('type', 'Employee');
  return qry.find();

  // return parseTableLoader.load(Employee({id: company.id}));
}

export function getSaleItems(sale) {
  const qry = new Parse.Query(SaleItem({id: sale.get('company').id}));
  qry.equalTo('sale', Parse.Object.extend('Sale_' + sale.get('company').id).createWithoutData(sale.id));
  qry.include([ 'sale', 'item' ]);
  qry.ascending('index');
  return qry.find();
}
export function getExpenseItems(expense) {
  const qry = new Parse.Query(ExpenseItem({id: expense.get('company').id}));
  qry.equalTo('expense', Parse.Object.extend('Expense_' + expense.get('company').id).createWithoutData(expense.id));
  qry.include([ 'expense' ]);
  qry.ascending('index');
  return qry.find();
}

export function getChartAccountList() {
  return Object.keys(chartOfAccounts).reduce(function (accounts, code) {
    accounts.push(chartOfAccounts[code]);
    return accounts;
  }, []);
}

export function queryOpenInvoices(company, {from,}) {
  const Type = Invoice({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

export function queryCustomerOpenInvoices(company, {from, id,}) {
  const Type = Invoice({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Invoice');

    query.equalTo('customer',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id))

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

export function querySalesRecentlyPaid(company, {from,}) {

  function getSalesQuery() {
    const Type = Sale({id: company.id});
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Sale');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  function getPaymentsOfInvoicesQuery() {
    const Type = PaymentOfInvoices({id: company.id});
    const query = new Parse.Query(Type);

    query.equalTo('type', 'PaymentOfInvoices');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  const mainQuery = Parse.Query.or(
    getSalesQuery(), getPaymentsOfInvoicesQuery());

  return mainQuery.find();
}

export function queryOverdueInvoices(company, {from,}) {
  const Type = Invoice({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Invoice');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().toDate());
    return query;
  }

  return getQuery().find();
}
export function queryCustomerOverdueInvoices(company, {from, id,}) {
  const Type = Invoice({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Invoice');

    query.equalTo('customer',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id))

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().toDate());
    return query;
  }

  return getQuery().find();
}

export function queryInvoices(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, }, last365Days = true) {
  const Type = Invoice({id: company.id});

  if(type !== 'invoices' && type !== 'open' && type !== 'overdue' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Invoice');

    switch (sortKey && doSort) {
      case 'date':
        query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
        break;
      case 'dueDate':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'balanceDue':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'total':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
    }
    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().toDate());
        break;
    }
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfBalances = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
          sumOfBalances += obj.get('balanceDue');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfBalances, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));
}
export function querySales(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer,}, last365Days = true) {
  const Type = Sale({id: company.id});

  if(type !== 'sales' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Sale');

    switch (sortKey && doSort) {
      case 'date':
        query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
        break;
      case 'balanceDue':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'total':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
    }
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, }, results ]) => ({ count, sumOfTotals, results, }));
}
export function queryPaymentsOfInvoices(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, customer,}, last365Days = true) {
  const Type = PaymentOfInvoices({id: company.id});

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'PaymentOfInvoices');

    switch (sortKey && doSort) {
      case 'date':
        query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
        break;
      case 'balanceDue':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'total':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
    }
    // TODO: query customers on items using matchesKeyInQuery
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfCredits = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('amountReceived');
          sumOfCredits += obj.get('amountToCredit');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfCredits, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfCredits, }, results ]) => ({ count, sumOfTotals, sumOfCredits, results, }));
}

export function customersQueryInvoices(company, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Invoice({id: company.id});

  if(type !== 'invoices' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        count++;
        return objs[0].get('customer');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Invoice');

    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().toDate());
        break;
    }

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([

    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}
export function customersQuerySales(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Sale({id: company.id});

  if(type !== 'sales' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        count++;
        return objs[0].get('customer');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Sale');

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}
export function customersQueryPaymentsOfInvoices(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = PaymentOfInvoices({id: company.id});

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('customer').id),

      objs => {
        count++;
        return objs[0].get('customer');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'PaymentOfInvoices');

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

export function queryOpenBills(company, {from,}) {
  const Type = Bill({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Bill');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}
export function queryVendorOpenBills(company, {from, id,}) {
  const Type = Bill({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Bill');

    query.equalTo('payee',
      Parse.Object.extend(`Peope_${company.id}`).createWithoutData(id));

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    return query;
  }

  return getQuery().find();
}

export function queryExpensesRecentlyPaid(company, {from,}) {

  function getExpensesQuery() {
    const Type = Expense({id: company.id});

    query.equalTo('type', 'Expense');

    const query = new Parse.Query(Type);
    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  function getPaymentsOfBillsQuery() {
    const Type = PaymentOfBills({id: company.id});

    query.equalTo('type', 'PaymentOfBills');

    const query = new Parse.Query(Type);
    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(DEFAULT_RECENT_DAYS, 'days').toDate());
    return query;
  }

  const mainQuery = Parse.Query.or(
    getExpensesQuery(), getPaymentsOfBillsQuery());

  return mainQuery.find();
}

export function queryOverdueBills(company, {from,}) {
  const Type = Bill({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Bill');

    query.greaterThanOrEqualTo('date',
      from ? new Date(from) : moment().subtract(365, 'days').toDate());
    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().toDate());
    return query;
  }

  return getQuery().find();
}
export function queryVendorOverdueBills(company, {from, id,}) {
  const Type = Bill({id: company.id});

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('payee',
      Parse.Object.extend(`People_${company.id}`).createWithoutData(id));

    if(from){
      query.greaterThanOrEqualTo('date',
        new Date(from));
    }

    query.greaterThan('balanceDue', 0.0);
    query.lessThan('dueDate', moment().toDate());
    return query;
  }

  return getQuery().find();
}

export function queryExpenses(company, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, payee, customer, }, last365Days = true) {
  const Type = Expense({id: company.id});

  if(type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Expense');

    switch (sortKey && doSort) {
      case 'date':
        query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
        break;
      case 'dueDate':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'balanceDue':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'total':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
    }
    if(payee){
      query.equalTo('vendor',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
    }
    if(customer){
      query.equalTo('customer',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, }, results ]) => ({ count, sumOfTotals, results, }));
}

export function queryBills(company, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, payee, customer,}, last365Days = true) {
  const Type = Bill({id: company.id});

  if(customer){
    return Promise.resolve({count: 0, results: []});
  }

  if(type !== 'bills' && type !== 'open' && type !== 'overdue' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Bill');

    switch (sortKey && doSort) {
      case 'date':
        query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
        break;
      case 'dueDate':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'balanceDue':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'total':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
    }
    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().toDate());
        break;
    }
    if(payee){
      query.equalTo('payee',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfBalances = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('total');
          sumOfBalances += obj.get('balanceDue');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfBalances, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));
}

export function queryPaymentsOfBills(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1, payee, customer, }, last365Days = true) {
  const Type = PaymentOfBills({id: company.id});

  if(customer){
    return Promise.resolve({count: 0, results: []});
  }

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getQuery(doSort = true) {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'PaymentOfBills');

    switch (sortKey && doSort) {
      case 'date':
        query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
        break;
      case 'balanceDue':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
      case 'total':
        query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
        if(sortKey === 1){
          query.addDescending('date');
        }
        break;
    }
    // TODO: query customers on items using matchesKeyInQuery
    if(payee){
      query.equalTo('payee',
        Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
    }

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    new Promise((resolve) => {
      let count = 0;
      let sumOfTotals = 0.0;
      let sumOfCredits = 0.0;

      getQuery(false).each(
        function(obj){
          count += 1;
          sumOfTotals += obj.get('amountReceived');
          sumOfCredits += obj.get('amountToCredit');
        }, {
          success: function(){
            resolve({ count, sumOfTotals, sumOfCredits, });
          },

          error: function(error){
            reject(error);
          }
        }
      );

    }),
    function(){
      const q = getQuery();
      q.skip(offset);
      q.limit(limit);
      return q.find();
    }()
  ]).then(([ { count, sumOfTotals, sumOfCredits, }, results ]) => ({ count, sumOfTotals, sumOfCredits, results, }));
}

export function getVendorOpenBills(company, {id}){
  const Type = Bill({id: company.id});
  const query = new Parse.Query(Type);

  query.equalTo('type', 'Bill');

  query.equalTo('payee',
    Parse.Object.extend(`People_${company.id}`).createWithoutData(id));
  query.greaterThan('balanceDue', 0.0);
  query.limit(100000);
  return query.find();
}

export function getPaymentOfBillsFromPaymentOfBillsItem(company, id){
  const Type = PaymentOfBillsItem({id: company.id});
  const query = new Parse.Query(Type);
  query.include([ 'payment' ]);
  return query.get(id)
    .then(obj => {
      const p = obj.get('payment');
      p.__type = 'PaymentOfBills';
      return p;
    });
}

export function getCustomerOpenInvoices(company, {id}){
  const Type = Invoice({id: company.id});
  const query = new Parse.Query(Type);

  query.equalTo('type', 'Invoice');

  query.equalTo('customer',
    Parse.Object.extend(`People_${company.id}`).createWithoutData(id));
  query.greaterThan('balanceDue', 0.0);
  query.limit(100000);
  return query.find();
}

export function getPaymentOfInvoicesFromPaymentOfInvoicesItem(company, id){
  const Type = PaymentOfInvoicesItem({id: company.id});
  const query = new Parse.Query(Type);
  query.include([ 'payment' ]);
  return query.get(id)
    .then(obj => {
      const p = obj.get('payment');
      p.__type = 'PaymentOfInvoices';
      return p;
    });
}

export function vendorsQueryExpenses(company, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false) {
  const Type = Expense({id: company.id});

  if(type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function getPayee(obj){
    if(obj.has('vendor')){
      return obj.get('vendor');
    }

    if(obj.has('customer')){
      return obj.get('customer');
    }

    return undefined;
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => getPayee(obj).id),

      objs => {
        const expense = objs[0];
        const payee = getPayee(expense);
        if(expense.get('payeeType') === 'Vendor' || expense.get('payeeType') === 2){
          count++;
          return payee;
        }

        return null;
      }
    )
    return {
      results: Parse.Object.fetchAllIfNeeded(compact(xs)),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Expense');

    query.include([ 'vendor', 'customer' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

export function cusomersQueryExpenses(company, { offset, limit, type, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false) {
  const Type = Expense({id: company.id});

  if(type !== 'expenses' && type !== 'recent' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('payee').id),

      objs => {
        const expense = objs[0];
        const payee = expense.get('payee');
        if(expense.get('payeeType') === 'Customer' || expense.get('payeeType') === 1){
          count++;
          return payee;
        }

        return null;
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(compact(xs)),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Expense');

    // query.equalTo('payeeType', 1);

    query.include([ 'payee' ]);

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

export function vendorsQueryBills(company, {offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = Bill({id: company.id});

  if(type !== 'bills' && type !== 'recent' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('payee').id),

      objs => {
        count++;
        return objs[0].get('payee');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'Bill');

    switch (status) {
      case 'closed':
        query.equalTo('balanceDue', 0.0);
        break;

      case 'open':
        query.greaterThan('balanceDue', 0.0);
        break;

      case 'overdue':
        query.greaterThan('balanceDue', 0.0);
        query.lessThan('dueDate', moment().toDate());
        break;
    }
    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

export function vendorsQueryPaymentsOfBills(company, {offset, limit, type, from, to, sortKey = 'date', sortDir = -1,}, last365Days = false) {
  const Type = PaymentOfBills({id: company.id});

  if(type !== 'payments' && type !== 'money' && type !== 'ALL'){
    return Promise.resolve({count: 0, results: []});
  }

  function aggregateResult(results){
    let count = 0;
    const xs = map(

      group(results, obj => obj.get('payee').id),

      objs => {
        const payee = objs[0].get('payee');
        count++;
        return objs[0].get('payee');
      }
    );
    return {
      results: Parse.Object.fetchAllIfNeeded(xs),
      count,
    };
  }

  function getQuery() {
    const query = new Parse.Query(Type);

    query.equalTo('type', 'PaymentOfBills');

    if(!from && !to){
      last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
    }else{
      to && query.lessThanOrEqualTo('date', new Date(to));
      from && query.greaterThanOrEqualTo('date', new Date(from));
    }
    return query;
  }

  return Promise.all([
    function(){
      const q = getQuery();
      // q.limit(offset + limit);
      q.limit(100000);
      return q.find();
    }()
  ]).then(([ results ]) => ({ ...aggregateResult(results), }));
}

export const User = Parse.User;

export function getObjectByType(Type, {companyId, id}) {
  return parseIDLoader.load([Type({id: companyId}), id]);
}

export function getObjectsByType(Type, {companyId}) {
  return parseTableLoader.load(Type({id: companyId}));
}

function getTypeById(Type, info) {
  const delimiterPos = info.indexOf(':');
  const id = info.substring(0, delimiterPos);
  const companyId = info.substring(delimiterPos + 1);
  return parseIDLoader.load([Type({id: companyId}), id]);
}

function countByType(Type) {
  return parseTableCountLoader.load(Type);
}

// V2

function ops__querySales(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, }, last365Days = true){

  if(type === 'invoices' || type === 'open' || type === 'overdue'){
    return queryInvoices(...arguments);
  }

  if(type === 'sales'){
    return querySales(...arguments);
  }

  if(type === 'payments'){
    return queryPaymentsOfInvoices(...arguments);
  }

  if(type === 'ALL'){
    return function(){
      const Type = Parse.Object.extend('Sale_' + company.id);

      function getQuery(doSort = true) {
        const query = new Parse.Query(Type);

        switch (sortKey && doSort) {
          case 'date':
            query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
            break;
          case 'dueDate':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'balanceDue':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'total':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(customer){
          query.equalTo('customer',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;
          let sumOfTotals = 0.0;
          let sumOfBalances = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;
              sumOfTotals += obj.get('total');
              sumOfBalances += obj.get('balanceDue');
            }, {
              success: function(){
                resolve({ count, sumOfTotals, sumOfBalances, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));

    }();
  }

  if(type === 'recent'){ // Invoices + Sales
    return function(){

      const Type = Parse.Object.extend('Sale_' + company.id);

      function getQuery(doSort = true) {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'Invoice');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Sale');

          return Parse.Query.or(
            q0,
            q1);
        }();

        switch (sortKey && doSort) {
          case 'date':
            query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
            break;
          case 'dueDate':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'balanceDue':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'total':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(customer){
          query.equalTo('customer',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;
          let sumOfTotals = 0.0;
          let sumOfBalances = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;
              sumOfTotals += obj.get('total');
              sumOfBalances += obj.get('balanceDue');
            }, {
              success: function(){
                resolve({ count, sumOfTotals, sumOfBalances, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();

          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));

    }();
  }

  if(type === 'money'){ // Sales + PaymentsOfInvoices
    return function(){

      const Type = Parse.Object.extend('Sale_' + company.id);

      function getQuery(doSort = true) {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'PaymentOfInvoices');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Sale');

          return Parse.Query.or(
            q0,
            q1);
        }();

        switch (sortKey && doSort) {
          case 'date':
            query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
            break;
          case 'dueDate':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'balanceDue':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'total':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(customer){
          query.equalTo('customer',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(customer));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;
          let sumOfTotals = 0.0;
          let sumOfBalances = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;
              sumOfTotals += obj.get('total');
              sumOfBalances += obj.get('balanceDue');
            }, {
              success: function(){
                resolve({ count, sumOfTotals, sumOfBalances, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();

          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));

    }();
  }
}

function ops__customersQuerySales(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false){

  if(type === 'invoices' || type === 'open' || type === 'overdue'){
    return customersQueryInvoices(...arguments);
  }

  if(type === 'sales'){
    return customersQuerySales(...arguments);
  }

  if(type === 'payments'){
    return customersQueryPaymentsOfInvoices(...arguments);
  }

  if(type === 'ALL'){
    return function(){

      const Type = Parse.Object.extend('Sale_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('customer').id),

          objs => {
            count++;
            return objs[0].get('customer');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = new Parse.Query(Type);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }

        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([

        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'recent'){ // Invoices + Sales
    return function(){

      const Type = Parse.Object.extend('Sale_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('customer').id),

          objs => {
            count++;
            return objs[0].get('customer');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'Invoices');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Sale');

          return Parse.Query.or(
            q0,
            q1);
        }();

        query.equalTo('type', 'Invoice');

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }

        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([

        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'money'){ // Sales + PaymentsOfInvoices
    return function(){

      const Type = Parse.Object.extend('Sale_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('customer').id),

          objs => {
            count++;
            return objs[0].get('customer');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'PaymentOfInvoices');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Sale');

          return Parse.Query.or(
            q0,
            q1);
        }();

        query.equalTo('type', 'Invoice');

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }

        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([

        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }
}



function ops__queryExpenses(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, customer, payee, }, last365Days = true){

  if(type === 'bills' || type === 'open' || type === 'overdue'){
    return queryBills(...arguments);
  }

  if(type === 'expenses'){
    return queryExpenses(...arguments);
  }

  if(type === 'payments'){
    return queryPaymentsOfBills(...arguments);
  }

  if(type === 'ALL'){
    return function(){

      const Type = Parse.Object.extend('Expense_' + company.id);

      function getQuery(doSort = true) {
        const query = new Parse.Query(Type);

        switch (sortKey && doSort) {
          case 'date':
            query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
            break;
          case 'dueDate':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'balanceDue':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'total':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(payee){
          query.equalTo('payee',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;
          let sumOfTotals = 0.0;
          let sumOfBalances = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;
              sumOfTotals += obj.get('total');
              sumOfBalances += obj.get('balanceDue');
            }, {
              success: function(){
                resolve({ count, sumOfTotals, sumOfBalances, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));

    }();
  }

  if(type === 'recent'){ // Bills + Expenses
    return function(){

      const Type = Parse.Object.extend('Expense_' + company.id);

      function getQuery(doSort = true) {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'Bill');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Expense');

          return Parse.Query.or(
            q0,
            q1);
        }();

        switch (sortKey && doSort) {
          case 'date':
            query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
            break;
          case 'dueDate':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'balanceDue':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'total':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(payee){
          query.equalTo('payee',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;
          let sumOfTotals = 0.0;
          let sumOfBalances = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;
              sumOfTotals += obj.get('total');
              sumOfBalances += obj.get('balanceDue');
            }, {
              success: function(){
                resolve({ count, sumOfTotals, sumOfBalances, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));

    }();
  }

  if(type === 'money'){ // Expenses + PaymentsOfBills
    return function(){

      const Type = Parse.Object.extend('Expense_' + company.id);

      function getQuery(doSort = true) {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'Expense');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'PaymentsOfBills');

          return Parse.Query.or(
            q0,
            q1);
        }();

        switch (sortKey && doSort) {
          case 'date':
            query[ sortDir === -1 ? 'descending' : 'ascending' ]('date');
            break;
          case 'dueDate':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'dueDate,date' : 'dueDate');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'balanceDue':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'balanceDue,date' : 'balanceDue');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
          case 'total':
            query[ sortDir === -1 ? 'descending' : 'ascending' ](sortDir === -1 ? 'total,date' : 'total');
            if(sortKey === 1){
              query.addDescending('date');
            }
            break;
        }
        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(payee){
          query.equalTo('payee',
            Parse.Object.extend(`People_${company.id}`).createWithoutData(payee));
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        new Promise((resolve) => {
          let count = 0;
          let sumOfTotals = 0.0;
          let sumOfBalances = 0.0;

          getQuery(false).each(
            function(obj){
              count += 1;
              sumOfTotals += obj.get('total');
              sumOfBalances += obj.get('balanceDue');
            }, {
              success: function(){
                resolve({ count, sumOfTotals, sumOfBalances, });
              },

              error: function(error){
                reject(error);
              }
            }
          );

        }),
        function(){
          const q = getQuery();
          q.skip(offset);
          q.limit(limit);
          return q.find();
        }()
      ]).then(([ { count, sumOfTotals, sumOfBalances, }, results ]) => ({ count, sumOfTotals, sumOfBalances, results, }));

    }();
  }
}


function ops__vendorsQueryExpenses(company, { offset, limit, type, status, from, to, sortKey = 'date', sortDir = -1, }, last365Days = false){

  if(type === 'bills' || type === 'open' || type === 'overdue'){
    return vendorsQueryBills(...arguments);
  }

  if(type === 'expenses'){
    return vendorsQueryExpenses(...arguments);
  }

  if(type === 'payments'){
    return vendorsQueryPaymentsOfBills(...arguments);
  }

  if(type === 'ALL'){
    return function(){

      const Type = Parse.Object.extend('Expense_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('payee').id),

          objs => {
            count++;
            return objs[0].get('payee');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = new Parse.Query(Type);

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'recent'){ // Bills + Expenses
    return function(){

      const Type = Parse.Object.extend('Expense_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('payee').id),

          objs => {
            count++;
            return objs[0].get('payee');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'Bill');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Expense');

          return Parse.Query.or(
            q0,
            q1);
        }();

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }

  if(type === 'money'){ // Expenses + PaymentsOfBills
    return function(){

      const Type = Parse.Object.extend('Expense_' + company.id);

      function aggregateResult(results){
        let count = 0;
        const xs = map(

          group(results, obj => obj.get('payee').id),

          objs => {
            count++;
            return objs[0].get('payee');
          }
        );
        return {
          results: Parse.Object.fetchAllIfNeeded(xs),
          count,
        };
      }

      function getQuery() {
        const query = function(){
          const q0 = new Parse.Query(Type);
          q0.equalTo('type', 'PaymentsOfBills');

          const q1 = new Parse.Query(Type);
          q1.equalTo('type', 'Expense');

          return Parse.Query.or(
            q0,
            q1);
        }();

        switch (status) {
          case 'closed':
            query.equalTo('balanceDue', 0.0);
            break;

          case 'open':
            query.greaterThan('balanceDue', 0.0);
            break;

          case 'overdue':
            query.greaterThan('balanceDue', 0.0);
            query.lessThan('dueDate', moment().toDate());
            break;
        }
        if(!from && !to){
          last365Days && query.greaterThanOrEqualTo('date', moment().subtract(365, 'days').startOf('day').toDate())
        }else{
          to && query.lessThanOrEqualTo('date', new Date(to));
          from && query.greaterThanOrEqualTo('date', new Date(from));
        }
        return query;
      }

      return Promise.all([
        function(){
          const q = getQuery();
          q.limit(100000);
          return q.find();
        }()
      ]).then(([ results ]) => ({ ...aggregateResult(results), }));

    }();
  }
}