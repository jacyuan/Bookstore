import React from 'react';
import axios from 'axios'
import CartCommunication from './CartCommunication.jsx'
import {browserHistory} from 'react-router'
let DatePicker = require('react-datepicker')
let moment = require('moment')

export default class CheckOut extends React.Component {
    constructor(props) {
        super(props);

        this.cart = CartCommunication.CurrentCart;

        this.state = {
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

        data.personalInfo.dueDate = data.personalInfo.dueDate
            ? new moment(data.personalInfo.dueDate).local().format('DD/MM/YYYY')
            : data.personalInfo.dueDate;

        let self = this;

        axios.post(url, data)
            .then(function () {
                browserHistory.push('/');
            })
            .catch(function (error) {
                if (error.response) {
                    let errors = error.response.data;
                    self.setState({
                        elementValid: {
                            email: errors.email,
                            street: errors.street,
                            city: errors.city,
                            dueDate: errors.dueDate
                        }
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

    getErrorIconClassName(eleName) {
        return this.state.elementValid && this.state.elementValid[eleName]
            ? ''
            : 'col-sm-1 btn glyphicon glyphicon-exclamation-sign';
    }

    render() {
        const errorIconStyle = {
            color: '#a94442'
        };

        const upperCase = {
            textTransform: 'uppercase'
        };

        const errorMsg = 'Something wrong...';
        const errorIcon = <span className='col-sm-1 btn glyphicon glyphicon-exclamation-sign' title={errorMsg}
                                style={errorIconStyle}/>;

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
                        {this.state.elementValid.email ? null : errorIcon}
                    </div>
                    <div className={this.getFormGroupClassName('street')}>
                        <label className="col-sm-4 control-label">Street *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="street" name="street" placeholder="Street"
                                   style={upperCase}
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
                        <div className="col-sm-7">
                            {/*<DatePicker id="dueDate" name="dueDate" className="form-control"*/}
                                        {/*dateFormat="DD/MM/YYYY"*/}
                                        {/*selected={this.state.personalInfo.dueDate}*/}
                                        {/*onChange={this.handleDateChange}*/}
                                        {/*minDate={moment().add(2, "days")}*/}
                                        {/*maxDate={moment().add(16, "days")}*/}
                                        {/*placeholderText="dd/MM/yyyy"/>*/}

                            <input type="text" className="form-control" id="dueDate" name="dueDate" placeholder="City"
                                   maxLength="50"
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
            </div>
        );
    }
}