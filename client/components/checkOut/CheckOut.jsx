import React from 'react';
import axios from 'axios'
import CartCommunicationService from '../services/Cart.communication.service.jsx'
import AlertCommunicationService from '../services/Alert.communication.service.jsx'
import {browserHistory} from 'react-router';
import moment from 'moment';

export default class CheckOut extends React.Component {
    constructor(props) {
        super(props);

        this.cart = CartCommunicationService.getCart();

        this.state = {
            isLoading: false,
            elementValid: {
                email: true,
                street: true,
                city: true,
                dueDate: true
            },
            personalInfo: {
                email: '',
                street: '',
                city: '',
                dueDate: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;

        let tmpPersoInfo = this.state.personalInfo;

        if (name === 'dueDate') {
            value = value && value.length === 10
                ? new moment(value, 'DD/MM/YYYY').format('DD/MM/YYYY')
                : undefined;
        }

        tmpPersoInfo[name] = value;

        this.setState({
            personalInfo: tmpPersoInfo
        });
    }

    startLoading() {
        this.setState({isLoading: true});
    }

    checkOut() {
        this.startLoading();

        let url = 'http://localhost:9000/carts';

        let data = {
            cart: this.cart,
            personalInfo: this.state.personalInfo
        };

        let self = this;

        axios.post(url, data)
            .then(function () {
                //empty the cart, raise event
                CartCommunicationService.setCart([]);

                browserHistory.push('#/bookList');
                AlertCommunicationService.raiseShowAlertEvent('Your command has been registered !', 'success');
            })
            .catch(function (error) {
                AlertCommunicationService.raiseShowAlertEvent('Something wrong with your input information', 'error');

                if (error.response) {
                    let errors = error.response.data;

                    self.setState({
                        elementValid: {
                            email: errors.email,
                            street: errors.street,
                            city: errors.city,
                            dueDate: errors.dueDate
                        },
                        isLoading: false
                    });
                } else {
                    console.log('Error', error.message);
                }
            });
    }

    getFormGroupClassName(eleName) {
        if (this.state.elementValid && this.state.elementValid[eleName]) {
            return 'form-group';
        }

        return 'form-group has-error';
    }

    render() {
        const errorIcon = <span className='col-sm-1 btn glyphicon glyphicon-exclamation-sign'
                                title='Something wrong...'
                                style={{color: '#a94442'}}/>;

        let books = this.cart.map(function (book, key) {
            return (
                <div className="form-group" key={key}>
                    <label className="col-sm-8 control-label">{book.title}</label>
                    <div className="col-sm-2">
                        <p className="form-control-static">{book.quantity}</p>
                    </div>
                </div>
            );
        });

        let nodes;

        if (this.state.isLoading) {
            nodes = (<div className='center-block uil-reload-css'>
                <div></div>
            </div>);
        } else {
            nodes = <div className="col-md-offset-2 col-md-8">
                <form className="form-horizontal">
                    <div className={this.getFormGroupClassName('email')}>
                        <label className="col-sm-4 control-label">Email address *</label>
                        <div className="col-sm-7">
                            <input type="email" className="form-control" id="email" name="email" placeholder="Email"
                                   onChange={this.handleInputChange}/>
                        </div>
                        {this.state.elementValid.email ? null : errorIcon}
                    </div>
                    <div className={this.getFormGroupClassName('street')}>
                        <label className="col-sm-4 control-label">Street *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="street" name="street" placeholder="Street"
                                   style={{textTransform: 'uppercase'}}
                                   onChange={this.handleInputChange}/>
                        </div>
                        {this.state.elementValid.street ? null : errorIcon}
                    </div>
                    <div className={this.getFormGroupClassName('city')}>
                        <label className="col-sm-4 control-label">City *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="city" name="city" placeholder="City"
                                   maxLength="50"
                                   onChange={this.handleInputChange}/>
                        </div>
                        {this.state.elementValid.city ? null : errorIcon}
                    </div>
                    <div className={this.getFormGroupClassName('dueDate')}>
                        <label className="col-sm-4 control-label">Due date of delivery *</label>

                        {/* React-datePicker component had been tested and added for this purpose in the earlier version,
                         but I got some problems while willing to switch the error icon visibility based on error*/}
                        <div className="col-sm-7">
                            <input type="date" className="form-control" id="dueDate" name="dueDate"
                                   placeholder="DD/MM/YYYY"
                                   maxLength="10" minLength="10"
                                   onChange={this.handleInputChange}/>
                        </div>
                        {this.state.elementValid.dueDate ? null : errorIcon}
                    </div>
                    <br/>
                    {books}
                </form>

                <br/>

                <button type="button" className="col-md-3 pull-right btn btn-default"
                        onClick={() => this.checkOut()}>
                    Check out
                </button>
            </div>;
        }

        return nodes;
    }
}