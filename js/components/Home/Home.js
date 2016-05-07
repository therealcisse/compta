import React, {Component} from 'react';
import Relay from 'react-relay';

import Loading from '../Loading/Loading';

import HomeRoute from '../../routes/HomeRoute';

import AddInvoiceMutation from '../../mutations/AddInvoiceMutation';
import AddSaleMutation from '../../mutations/AddSaleMutation';
import AddExpenseMutation from '../../mutations/AddExpenseMutation';
import AddBillMutation from '../../mutations/AddBillMutation';
import ReceivePaymentOfInvoicesMutation from '../../mutations/ReceivePaymentOfInvoicesMutation';
import ReceivePaymentOfBillsMutation from '../../mutations/ReceivePaymentOfBillsMutation';

import LogOutMutation from '../../mutations/LogOutMutation';
import RemoveCompanyMutation from '../../mutations/RemoveCompanyMutation';
import AddCompanyMutation from '../../mutations/AddCompanyMutation';

class Home extends Component {
  render() {
    return (
      <div>
        {React.cloneElement(this.props.children, { ...this.props, })}
      </div>
    );
  }
}

Home = Relay.createContainer(Home, {
  initialVariables: {},

  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
          id,
          objectId,
          displayName,
          username,
          email,
          createdAt,
          updatedAt,
          sessionToken,

          ${LogOutMutation.getFragment('viewer')},
          ${RemoveCompanyMutation.getFragment('viewer')},
          ${AddCompanyMutation.getFragment('viewer')},

          ${AddExpenseMutation.getFragment('viewer')},
          ${AddInvoiceMutation.getFragment('viewer')},
          ${AddSaleMutation.getFragment('viewer')},
          ${AddBillMutation.getFragment('viewer')},
          ${ReceivePaymentOfInvoicesMutation.getFragment('viewer')},
          ${ReceivePaymentOfBillsMutation.getFragment('viewer')},
      }
    `,
  },
});

module.exports = (props) => (
  <Relay.RootContainer
    forceFetch={true}
    Component={Home}
    route={new HomeRoute()}
    renderLoading={function() {
      return (
        <div className="home loading">

          <div className="content">

              <Loading/>

          </div>

        </div>
      );
    }}
    renderFetched={function(data) {
       return <Home {...props} {...data}/>;
    }}
  />
);
