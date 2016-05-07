import Parse from 'parse';

export default company => {

  const name = `Customer_${company.id}`;

  class Customer extends Parse.Object {
    __type = 'Customer';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Customer);

  return Customer;
}