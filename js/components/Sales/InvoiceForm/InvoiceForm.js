import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';

import stopEvent from '../../../utils/stopEvent';

import invoiceValidation, {} from './invoiceValidation';
import * as invoiceActions from '../../../redux/modules/invoices';

import JournalEntries from '../../JournalEntries/JournalEntries';

import Title from '../../Title/Title';

import { setBeforeUnloadMessage, unsetBeforeUnloadMessage, } from '../../../utils/unbeforeunload';

import Actions from '../../confirm/actions';
import NotifyActions from '../../notification/NotifyActions';

import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';

import classnames from 'classnames';

import Alert from '../../Alert/Alert';

import styles from './InvoiceForm.scss';

import CSSModules from 'react-css-modules';

import Modal from 'react-bootstrap/lib/Modal';

import Dialog, {Header, Body, Footer} from '../../utils/Dialog';

import throttle from 'lodash.throttle';

import getFieldValue from '../../utils/getFieldValue';

import moment from 'moment';

import events from 'dom-helpers/events';

import {getBodyHeight, getBodyWidth} from '../../../utils/dimensions'

import {
  intlShape,
} from 'react-intl';

import messages from './messages';

import requiredPropType from 'react-prop-types/lib/all';

import CustomerDetails from './CustomerDetails';
import BalanceDue from './BalanceDue';
import BillingDetails from './BillingDetails';
import ProductItems from './ProductItems';
import TotalLine from './TotalLine';
// import TaxForm from './TaxForm';
import DiscountForm from './DiscountForm';
import Memo from './Memo';
import Files from './Files';

function getMinHeight() {
  return getBodyHeight() - 45 /* HEADER */ - 50 /* FOOTER */;
}

function getTermsNumberOfDays(terms){
  switch (terms) {
    case 'OnReception':  return 0;
    case 'Net_15':       return 15;
    case 'Net_30':       return 30;
    case 'Net_60':       return 60;
    case 'Custom':       throw 'getTermsNumberOfDays#InvalidTerms';
  }
}

function normalizeMoment(d){
  return moment(d)
    .seconds(0)
    .minutes(0)
    .hour(0);
}

const discountTypesById = { 'Value': 1, 'Percent': 2, };

import formatAddress from '../../../utils/formatAddress';

function getBillingAddress({
  displayName,
  billing_streetAddress,
  billing_cityTown,
  billing_stateProvince,
  billing_postalCode,
  billing_country,
}){
  const addr = formatAddress({
    address: billing_streetAddress,
    city: billing_cityTown,
    // subdivision: billing_stateProvince,
    postalCode: billing_postalCode,
    // country: billing_country,
  });

  return addr.length === 0 ? undefined : [displayName, ...addr].join('\n');
}

@reduxForm({
  form: 'invoice',
  fields: [
    'id',
    'customer',
    'billingAddress',
    'terms',
    'date',
    'dueDate',
    'discountType',
    'discountValue',
    'memo',
    'files',
  ],
  validate: invoiceValidation,
  asyncBlurFields: [],
  destroyOnUnmount: true,
}, (state, ownProps) => ({
  customer: ownProps.customer,
  filterArgs: ownProps.filterArgs,
  editing: state.invoices.editing,
  saveError: state.invoices.saveError,
  initialValues: ownProps.invoice ? {
    ...ownProps.invoice,
    date: normalizeMoment(moment(ownProps.invoice.date)).format(),
    dueDate: normalizeMoment(moment(ownProps.invoice.dueDate)).format(),
    discountType: discountTypesById[ownProps.invoice.discountType],
  } : function(){
    const customer = ownProps.customer ? {
      className: `Customer_${ownProps.company.objectId}`,
      id: ownProps.customer.objectId,
      objectId: ownProps.customer.objectId,
    } : undefined;
    return {
      terms: ownProps.company.salesSettings.preferredInvoiceTerms,
      date: normalizeMoment(moment()).format(),
      dueDate: normalizeMoment(moment().add(
        getTermsNumberOfDays(ownProps.company.salesSettings.preferredInvoiceTerms), 'days')).format(),
      discountType: 2,
      customer,
      billingAddress: (customer ? getBillingAddress(customer) : undefined),
    };
  }(),
}), dispatch => bindActionCreators(invoiceActions, dispatch))
@CSSModules(styles, {allowMultiple: true})
export default class extends Component {

  static displayName = 'InvoiceForm';

  static contextTypes = {
    intl: intlShape.isRequired,
  };

  static propTypes = {
    invoice: requiredPropType(
      React.PropTypes.object,
      function(props, propName, componentName) {
        if (props.formKey !== 'NEW' && !props.invoice) {
          return new Error('InvoiceForm: invoice required!');
        }
      }
    ),

    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    editStart: PropTypes.func.isRequired,
    editStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    valid: PropTypes.bool.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    setActiveRow: PropTypes.func.isRequired,
    addMoreRows: PropTypes.func.isRequired,
    clearAllRows: PropTypes.func.isRequired,
    clearRow: PropTypes.func.isRequired,
    resetLines: PropTypes.func.isRequired,
    moveOp: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired,

    company: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };

  state = {
    modalOpen: false,
  };

  componentDidMount() {
    events.on(window, 'resize', this._handleWindowResize);
    // this._showHelp();

    this.refs.client && this.refs.client.focus();
  }

  _showHelp(){
    if(process.env.NODE_ENV === 'production' && localStorage.getItem('invoice-form.help.done', false)){
      return;
    }

    const {styles} = this.props;

    const {intl,} = this.context;

    const Component = ({remove}) => {
      this._removeHelp = remove;
      return (
        <div className='card card-block card-inverse card-info' style={{}}>
          <h3 className='card-title'>{intl.formatMessage(messages['welcome'])}</h3>

          <p className='card-text'>
            {intl.formatMessage(messages['welcome_intro'])}:
          </p>

          <p className='card-text'>
            {this.props.company.salesSettings.showProducts
              ? <cite style={{display: 'block'}}>1. {intl.formatMessage(messages['rule_1_1'])}</cite>
              : <cite style={{display: 'block'}}>1. {intl.formatMessage(messages['rule_2_1'])}</cite>
            }

            {this.props.company.salesSettings.showRates
              ? <cite style={{display: 'block'}}>2. {intl.formatMessage(messages['rule_1_2'])}</cite>
              : <cite style={{display: 'block'}}>1. {intl.formatMessage(messages['rule_2_2'])}</cite>
            }
          </p>

          <a onClick={e => {localStorage.setItem('invoice-form.help.done', true); remove();}} className='btn btn-primary' style={{textTransform: 'uppercase'}}>{intl.formatMessage(messages['got_it'])}</a>
        </div>
      )
    };

    setTimeout(() => {

      NotifyActions.add({
        type: 'custom',
        data: Component,
        duration: 3 * 60000,
        slug: styles['invoice-form--error-message'],
        onRemove: () => { this._removeHelp = undefined; },
      });

    }, 1000);
  }

  componentWillUnmount() {
    this._removeHelp && this._removeHelp();
    unsetBeforeUnloadMessage();
    events.off(window, 'resize', this._handleWindowResize);
  }

  componentDidUpdate(){
    const { intl, } = this.context;

    const {
      dirty,
      formKey,
      editing: {
        [formKey]: store,
      },
    } = this.props;

    if(dirty || store.isDirty){
      setBeforeUnloadMessage(
        intl.formatMessage(messages['Confirm'])
      );
    }
  }

  _handleWindowResize = throttle(() => {
    this.forceUpdate();
  }, 150);

  _handleClose = () => {
    this.props.onCancel();
  };

  _handleSaveAndNew = () => {
    this._handleClose();

    setTimeout(() => {
      this.props.onNew();
    }, 200);
  };

  _handleCancel = () => {
    const {intl,} = this.context;
    const {
      dirty,
      formKey,
      editing: {
        [formKey]: store,
      },
    } = this.props;

    if(dirty || store.isDirty){
      Actions.show(intl.formatMessage(messages['Confirm']))
        .then(this.props.onCancel)
        .catch(() => {});
    }else{
      this.props.onCancel();
    }
  };

  _onSave(){
    return this.props.handleSubmit((data) => {

      const {
        styles,
        formKey,
        editing: {
          [formKey]: store,
        },
      } = this.props;

      const items = [];

      for(let i = 0, _len = store.getSize(); i < _len; i++){
        const line = store.getObjectAt(i);

        if(line.dirty){
          const {field, valid} = store.isValid(line);

          if(valid){
            items.push(decorateItem(i, line));
            continue;
          }else{
            store.setShowErrors(true);
            store.setActiveRow({rowIndex: i, cell: field});
            return Promise.reject();
          }
        }

        if(line.objectId || line.id || line.__dataID__){
          items.push(decorateItem(i, line));
        }
      }

      if(items.length === 0){
        const {intl,} = this.context;
        NotifyActions.add({
          type: 'danger',
          slug: styles['invoice-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        this.props.save({ ...decorateData(data), id: this.props.invoice && this.props.invoice.objectId, invoice: this.props.invoice, _customer: this.props.customer, items, company: this.props.company, viewer: this.props.viewer, })
              .then(result => {
                if (result && typeof result.error === 'object') {
                  // return reject(); // messages['error']
                  return resolve();
                }

                // if(close){
                //   this._handleClose();
                // }else{
                //   this._handleSaveAndNew();
                // }
               resolve();
             })/*.catch((error) => {
                if(process.env.NODE_ENV !== 'production') { console.error(error); }
                // reject(messages['error']);
                resolve();
              })*/;
      });
    });
  }
  _onSaveClose(close = true){
    return this.props.handleSubmit((data) => {

      const {
        styles,
        formKey,
        editing: {
          [formKey]: store,
        },
      } = this.props;

      const items = [];

      for(let i = 0, _len = store.getSize(); i < _len; i++){
        const line = store.getObjectAt(i);

        if(line.dirty){
          const {field, valid} = store.isValid(line);

          if(valid){
            items.push(decorateItem(i, line));
            continue;
          }else{
            store.setShowErrors(true);
            store.setActiveRow({rowIndex: i, cell: field});
            return Promise.reject();
          }
        }

        if(line.objectId || line.id || line.__dataID__){
          items.push(decorateItem(i, line));
        }
      }

      if(items.length === 0){
        const {intl,} = this.context;
        NotifyActions.add({
          type: 'danger',
          slug: styles['invoice-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['at_least_one_entry_required'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        this.props.save({ ...decorateData(data), id: this.props.invoice && this.props.invoice.objectId, invoice: this.props.invoice, items, _customer: this.props.customer, company: this.props.company, viewer: this.props.viewer, })
              .then(result => {
                if (result && typeof result.error === 'object') {
                  return reject(); // messages['error']
                }

                if(close){
                  this._handleClose();
                }else{
                  this._handleSaveAndNew();
                }
               resolve();
             })/*.catch((error) => {
                if(process.env.NODE_ENV !== 'production') { console.error(error); }
                reject(messages['error']);
              })*/;
      });
    });
  }

  _onReceivePayment = (invoice) => {
    this.props.onReceivePayment(invoice);
  };

  render() {
    const self = this;

    const {
      formKey,
      dirty,
      editStart,
      editStop,
      fields: {
        id,
        customer,
        billingAddress,
        terms,
        date,
        dueDate,
        discountType,
        discountValue,
        memo,
        files,
      },
      valid,
      invalid,
      pristine,
      save,
      submitting,
      saveError: {
        [formKey]: saveError,
      },
      editing: {
        [formKey]: store,
      },
      values,

      onCancel,

      styles,

      setActiveRow,
      addMoreRows,
      clearAllRows,
      clearRow,
      moveOp,
      resetLines,

      refresh,

      invoice,

    } = this.props;

    // console.log('=====================================');
    //
    // console.log('Valid', valid);
    // console.log('Invalid', invalid);
    // console.log('initialValues', [id, customer, billingAddress, terms, date, dueDate, discountType, discountValue, memo, files].map(({initialValue}) => initialValue));
    // console.log('Values', values);
    // console.log('Values 2', [id, customer, billingAddress, terms, date, dueDate, discountType, discountValue, memo, files].map(({value}) => value));
    // console.log('Invalids', [id, customer, billingAddress, terms, date, dueDate, discountType, discountValue, memo, files].filter(({invalid}) => invalid));
    //
    // console.log('=====================================');

    const {intl,} = this.context;

    const bodyWidth = getBodyWidth();

    const minHeight = getMinHeight();

    return (
      <Modal dialogClassName={`${styles['modal']} invoice-form`}
             dialogComponentClass={Dialog}
             className={classnames({'invoice-form form modal-fullscreen': true, [styles['invoice-form'] || '']: true, })}
             show={true} keyboard={true} backdrop={false} onHide={() => this._handleCancel()} autoFocus enforceFocus>

        <Header style={{ backgroundColor:'#486c8f', height: 45, padding: '7px 16px', }}>

          <div styleName='tableCell'>

            <div styleName='f-title'
                 style={{display: 'inline-block', }}>{intl.formatMessage(messages['Title'])}{invoice ? ` nº${invoice.refNo}` : ''}
            </div>

            <div styleName='icon'>
              <i style={{verticalAlign: 'middle'}} className='material-icons md-light' style={{}}>settings</i>
            </div>

          </div>

        </Header>

        <Body>

          <div styleName='table stretch'>

            <div styleName='tableCell'>

              <div>

                <div className='the-container table' style={{}}>

                  <div style={{}}>

                    <div styleName='invoiceTop ' style={getTopStyle(this.props.invoice)}>

                      <div styleName='innerRow' style={{position: 'relative',}}>

                        <div styleName='customerDetailsBox'>
                          <CustomerDetails
                            ref={'client'}
                            company={this.props.company}
                            viewer={this.props.viewer}
                            formKey={formKey}
                            fields={{customer, dirty, valid, invalid, pristine, submitting, values,}}
                          />
                        </div>

                        <div styleName='balanceDueBox' style={{position: 'absolute', right: 0, textAlign: 'right',}}>
                          <BalanceDue
                            store={store}
                            company={this.props.company}
                            invoice={this.props.invoice}
                            formKey={formKey}
                            fields={{
                              dirty,
                              date,
                              dueDate,
                              discountType,
                              discountValue,
                              dirty,
                              valid,
                              invalid,
                              pristine,
                              submitting,
                              values,
                            }}
                            onReceivePayment={this._onReceivePayment}
                          />
                        </div>

                      </div>

                    </div>

                    {saveError && <Alert title={intl.formatMessage(messages['ErrorTitle'])} type={'error'}>{intl.formatMessage({ ...saveError, id: saveError._id, })}</Alert>}

                    <div styleName='billingDetailsRow'>

                      <div styleName='innerRow'>

                        <BillingDetails
                          company={this.props.company}
                          formKey={formKey}
                          fields={{billingAddress, terms, date, dueDate, dirty, valid, invalid, pristine, submitting, values,}}
                        />

                      </div>

                    </div>

                    <div styleName='itemsContainerRow '>

                      <div styleName='innerRow'>

                        <div styleName='items'>

                          <ProductItems
                            salesAccounts={this.props.salesAccounts}
                            refresh={refresh}
                            company={this.props.company}
                            invoice={this.props.invoice}
                            viewer={this.props.viewer}
                            formKey={formKey}
                            store={store}
                            fields={{dirty, valid, invalid, setActiveRow, resetLines, addMoreRows, clearAllRows, clearRow, moveOp, pristine, submitting, values,}}
                            height={minHeight}
                            bodyWidth={bodyWidth}
                          />

                        </div>

                      </div>

                    </div>

                    <div>

                      <div styleName='innerRow'>

                        <div className='row' style={{}}>

                          <div className='col-sm-6 first-col'>

                            <div styleName='memoRow'>

                              <div styleName='innerRow'>

                                <Memo
                                  formKey={formKey}
                                  fields={{memo, dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>

                          </div>


                          <div className='col-sm-6 last-col'>

                            {/*<div styleName='taxableSubtotalLineRow'>

                              <div styleName='innerRow'>

                                <TaxableSubtotalLine
                                  formKey={formKey}
                                  store={store}
                                  fields={{dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>*/}

                            {this.props.company.salesSettings.discountEnabled && <div styleName='discountFormRow'>

                              <div styleName='innerRow'>

                                <DiscountForm
                                  formKey={formKey}
                                  store={store}
                                  fields={{dirty, discountType, discountValue, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>}

                            {/*<div styleName='taxFormRow'>

                              <div styleName='innerRow'>

                                <TaxForm
                                  formKey={formKey}
                                  store={store}
                                  fields={{dirty, discountType, discountValue, taxPercent, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>*/}

                            <div styleName='totalRow'>

                              <div styleName='innerRow'>

                                <TotalLine
                                  formKey={formKey}
                                  store={store}
                                  invoice={this.props.invoice}
                                  fields={{
                                    dirty,
                                    discountType,
                                    discountValue,
                                    valid,
                                    invalid,
                                    pristine,
                                    submitting,
                                    values,
                                  }}
                                />

                              </div>

                            </div>

                        </div>


                      </div>


                    </div>

                    <div>

                      <div styleName='innerRow'>

                        <div className='row' style={{}}>

                          <div className='col-sm-12 first-col last-col'>

                            <div styleName='filesRow'>

                              <hr styleName="sectionDivider"/>

                              <div styleName='innerRow' style={{width: '40%', minWidth: 492,}}>

                                <Files
                                  formKey={formKey}
                                  fields={{files, dirty, valid, invalid, pristine, submitting, values,}}
                                />

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </Body>

        <Footer>

          <div styleName='tableCell' style={{textAlign: 'left'}}>

            <button
              styleName='btn dark'
              onClick={() => this._handleCancel()}
              disabled={submitting}
              className='unselectable'>{intl.formatMessage(messages['cancel'])}
            </button>

          </div>

          <div styleName='tableCell' style={{textAlign: 'center'}}>

            <div>
              {invoice && <InvoiceActions onDelete={this._del()} onShowJournalEntries={this._showJournal} className={'unselectable'} styles={styles}/>}
            </div>

          </div>

          <div styleName='tableCell' style={{textAlign: 'right'}}>

            {/*<button
              styleName='btn primary'
              onClick={this._onSave()}
              disabled={invalid || submitting || !_dirty}
              className={'unselectable' + (valid && _dirty ? ' green valid' : (invalid || submitting || !_dirty ? ' disabled' : ''))}>
              {' '}{intl.formatMessage(messages['save'])}
            </button>*/}

            {/*<button
              styleName='btn primary'
              style={{marginLeft: 12}}
              onClick={this._onSave()}
              disabled={invalid || submitting}
              className={'unselectable' + (valid ? ' green valid' : (invalid || submitting ? ' disabled' : ''))}>
              {' '}{intl.formatMessage(messages['saveAndNew'])}
            </button>*/}

            {function(){
              const _dirty = dirty || store.isDirty;
              return (
                <MySplitButton
                  className={'unselectable' + (valid && _dirty ? ' green valid' : (invalid || submitting || !_dirty ? ' disabled' : ''))}
                  styleName={'btn primary'}
                  styles={styles}
                  valid={valid}
                  onSave={self._onSave.bind(self)}
                  onSaveClose={self._onSaveClose.bind(self)}
                  disabled={invalid || submitting || !_dirty}
                  submitting={submitting}
                />
              );
            }()}

          </div>

        </Footer>

        {this.journalEntriesModal()}

        <Title title={intl.formatMessage(messages['Title'])}/>

      </Modal>
    );
  }

  _del = () => {
    const {intl,} = this.context;

    return this.props.handleSubmit(() => {

      if(this.props.invoice.paymentsConnection.edges.length > 0){
        NotifyActions.add({
          type: 'danger',
          slug: this.props.styles['invoice-form--error-message'],
          data: () => (
                <span>
                  {intl.formatMessage(messages['error_has_payments'])}
                </span>
          ),
        });

        return Promise.reject();
      }

      return Actions.show(intl.formatMessage(messages['ConfirmDelete']))
        .then(() => {
          return new Promise((resolve, reject) => {
            this.props.del({ invoice: this.props.invoice, company: this.props.company, viewer: this.props.viewer, })
                  .then(result => {
                    if (result && typeof result.error === 'object') {
                      return reject(); // messages['error']
                    }

                    this._handleClose();
                   resolve();
                 })/*.catch((error) => {
                    if(process.env.NODE_ENV !== 'production') { console.error(error); }
                    reject(messages['error']);
                  })*/;
          });
        })
        .catch(() => {});
    });
  };

  _showJournal = (e) => {
    stopEvent(e);
    this.setState({
      modalOpen: true,
    })
  };

  _close = (e) => {
    stopEvent(e);
    this.setState({
      modalOpen: false,
    })
  };

  journalEntriesModal = () => {
    if(this.state.modalOpen){
      return (
        <JournalEntries
          type={'Invoice'}
          company={this.props.company}
          viewer={this.props.viewer}
          person={this.props.invoice.customer}
          id={this.props.invoice.objectId}
          onCancel={this._close}
        />
      );
    }
  }

}

function unNormalizeMoment(d){
  const n = moment();
  return moment(d)
    .hour(n.hour())
    .minutes(n.minute())
    .seconds(n.seconds());
}

const discountTypeValueByIndex = {
  2: 'Percent',
  1: 'Value',
};

function decorateData({
  billingAddress, customer, discountType, discountValue, date, dueDate, memo, files, terms}){
  return {
    billingAddress,
    customer: {
      className: customer.className,
      id: customer.objectId,
    },
    discountType: discountTypeValueByIndex[discountType],
    discountValue,
    date: unNormalizeMoment(moment(date)).format(),
    dueDate: moment(dueDate).endOf('day').format(),
    memo,
    files,
    terms,
  };
}

function getDiscountType(type){
  return type;
  // switch (type) {
  //   case 'Percent': return 2;
  //   case 'Value':   return 1;
  // }
}

function decorateItem(index, {
  date,
  description,
  item,
  qty,
  rate,
  discountPart,
}){
  return {
    index,
    date: date ? unNormalizeMoment(moment(date)).format() : undefined,
    description,
    item: {
      className: item.className,
      id: item.objectId,
    },
    qty,
    rate,
    discountPart: {
      type: getDiscountType(discountPart.type),
      value: discountPart.value,
    },
  };
}

function getTopStyle(invoice){
  if(!invoice){
    return {
      height: 100,
      minHeight: 100,
    };
  }

  const status = invoice.status;

  switch (status) {
    case 'Open': return {
      height: 155 + (invoice.paymentsConnection.totalCount > 0 ? 20 : 0),
      minHeight: 155 + (invoice.paymentsConnection.totalCount > 0 ? 20 : 0),
    };
    case 'Overdue': return {
      height: 250 + (invoice.paymentsConnection.totalCount > 0 ? 10 : 0),
      minHeight: 250 + (invoice.paymentsConnection.totalCount > 0 ? 10 : 0),
    };
    case 'Closed': return {
      height: 180 + (invoice.paymentsConnection.totalCount > 0 ? 30 : 0),
      minHeight: 180 + (invoice.paymentsConnection.totalCount > 0 ? 30 : 0),
    };
  }
}

class MySplitButton extends Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  render(){
    const {intl} = this.context;
    const {onSave, onSaveClose, className, disabled, submitting, valid, styles, } = this.props;
    const title = (
      <span>{submitting ? <i className={`${styles['submitting']} material-icons`}>loop</i> : null}{' '}{intl.formatMessage(messages['saveAndClose'])}</span>
    );
    return (
      <div className={styles['dropdown']}>
        <ButtonToolbar>

          <SplitButton className={className} disabled={disabled} onClick={onSaveClose()} title={title} dropup pullRight id={'invoice-form'}>

            <MenuItem onClick={onSaveClose(false)} eventKey={'1'}>
              {intl.formatMessage(messages['saveAndNew'])}
            </MenuItem>

          </SplitButton>

          <button
            // styleName='btn primary'
            onClick={onSave()}
            style={{marginLeft: 12,}}
            disabled={disabled}
            className={`hidden ${disabled ? 'disabled' : ''} ${styles['btn']} ${styles['dark']}`}>
            {' '}{intl.formatMessage(messages['save'])}
          </button>

        </ButtonToolbar>
      </div>
    );
  }
}

class InvoiceActions extends Component{
  static contextTypes = {
    intl: intlShape.isRequired,
  };
  _onDelete = (e) => {
    stopEvent(e);
    this.props.onDelete();
  };
  _onShowJournalEntries = (e) =>{
    stopEvent(e);
    this.props.onShowJournalEntries();
  };
  render(){
    const {intl} = this.context;
    const { className, styles, onDelete, onShowJournalEntries, } = this.props;
    return (
      <div className={styles['actions-dropdown']}>
        <ButtonToolbar>

          <DropdownButton bsStyle={'link'} noCaret title={intl.formatMessage(messages['Actions'])} className={className} dropup>

            <MenuItem onClick={this._onDelete} eventKey={'delete'}>
              {intl.formatMessage(messages['Delete'])}
            </MenuItem>

            <MenuItem onClick={this._onShowJournalEntries} eventKey={'journalEntries'}>
              {intl.formatMessage(messages['JournalEntries'])}
            </MenuItem>

          </DropdownButton>

        </ButtonToolbar>
      </div>
    );
  }
}