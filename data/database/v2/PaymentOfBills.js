import Parse from 'parse';

export default company => {

  const name = `Expense_${company.id}`;

  class PaymentOfBills extends Parse.Object {
    __type = 'PaymentOfBills';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, PaymentOfBills);

  return PaymentOfBills;
}