import React from 'react';
import axios from 'axios'
import CartCommunication from './CartCommunication.jsx'
let DatePicker = require('react-datepicker');
let moment = require('moment');

export default class CheckOut extends React.Component {
    constructor(props) {
        super(props);

        this.cart = CartCommunication.CurrentCart;

        this.state = {
            errorElements: {
                email: false,
                street: false,
                city: false,
                dueDate: false
            },
            personalInfo: {
                email: '',
                street: '',
                city: '',
                dueDate: ''
            }
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        let tmpPersoInfo = this.state.personalInfo;
        tmpPersoInfo[name] = value;

        this.setState({
            personalInfo: tmpPersoInfo
        });
    }

    handleDateChange(val) {
        let tmpPersoInfo = this.state.personalInfo;
        tmpPersoInfo.dueDate = val;

        this.setState({
            personalInfo: tmpPersoInfo
        });
    }

    checkOut() {
        let url = 'http://localhost:9000/carts';

        let data = {
            cart: this.cart,
            personalInfo: this.state.personalInfo
        };

        data.personalInfo.dueDate = data.personalInfo.dueDate.local().format('DD/MM/YYYY');

        axios.post(url, data)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
                console.log(error.data);
            });
    }

    getFormGroupClassName(eleName) {
        if (this.state.errorElements && this.state.errorElements[eleName]) {
            return 'form-group has-error';
        }

        return 'form-group';
    }

    getErrorIconClassName(eleName) {
        if (this.state.errorElements && this.state.errorElements[eleName]) {
            return 'col-sm-1 btn glyphicon glyphicon-exclamation-sign';
        }

        return '';
    }

    render() {
        const errorIconStyle = {
            color: '#a94442'
        };

        const upperCase = {
            textTransform: 'uppercase'
        };

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

        return (
            <div className="col-md-offset-2 col-md-8">
                <form className="form-horizontal">
                    <div className={this.getFormGroupClassName('email')}>
                        <label className="col-sm-4 control-label">Email address *</label>
                        <div className="col-sm-7">
                            <input type="email" className="form-control" id="email" name="email" placeholder="Email"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('email')}
                              title="error"
                              style={errorIconStyle}/>
                    </div>
                    <div className={this.getFormGroupClassName('street')}>
                        <label className="col-sm-4 control-label">Street *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="street" name="street" placeholder="Street"
                                   style={upperCase}
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('street')} title="error"
                              style={errorIconStyle}/>
                    </div>
                    <div className={this.getFormGroupClassName('city')}>
                        <label className="col-sm-4 control-label">City *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="city" name="city" placeholder="City"
                                   maxLength="50"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('city')} title="error"
                              style={errorIconStyle}/>
                    </div>
                    <div className={this.getFormGroupClassName('dueDate')}>
                        <label className="col-sm-4 control-label">Due date of delivery *</label>
                        <div className="col-sm-7">
                            <DatePicker id="dueDate" name="dueDate" className="form-control"
                                        dateFormat="DD/MM/YYYY"
                                        selected={this.state.personalInfo.dueDate}
                                        onChange={this.handleDateChange}
                                        minDate={moment().add(2, "days")}
                                        maxDate={moment().add(16, "days")}
                                        placeholderText="dd/MM/yyyy"/>
                        </div>
                        <span className={this.getErrorIconClassName('dueDate')} title="error"
                              style={errorIconStyle}/>
                    </div>
                    <br/>
                    {books}
                </form>

                <br/>

                <button type="button" className="col-md-3 pull-right btn btn-default"
                        onClick={() => this.checkOut()}>
                    Check out
                </button>
            </div>
        );
    }
}