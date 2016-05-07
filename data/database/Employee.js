import Parse from 'parse';

export default company => {

  const name = `Employee_${company.id}`;

  class Employee extends Parse.Object {
    __type = 'Employee';

    constructor() {
      super(name);
    }
  }

  Parse.Object.registerSubclass(name, Employee);

  return Employee;
}
