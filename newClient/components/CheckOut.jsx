import React from 'react';

export default class CheckOut extends React.Component {
    constructor(props) {
        super(props);
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
    }

    // getInitialState() {
    //     return {
    //         errorElements: {
    //             email: false,
    //             street: false,
    //             city: false,
    //             dueDate: false
    //         },
    //         personalInfo: {
    //             email: '',
    //             street: '',
    //             city: '',
    //             dueDate: ''
    //         }
    //     };
    // }

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

    checkOut() {
        let url = 'http://localhost:9000/carts';

        let data = {
            cart: this.context.cart,
            personalInfo: this.state.personalInfo
        };

        axios.post(url, data)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
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
        let books = this.context.cart.map(function (book, key) {
            return (
                <div className="form-group" key={key}>
                    <label className="col-sm-8 control-label">{book.title}</label>
                    <div className="col-sm-2">
                        <p className="form-control-static">{book.quantity}</p>
                    </div>
                </div>
            );
        });

        let errorIconStyle = {
            color: '#a94442'
        };

        return (
            <div className="col-md-offset-2 col-md-8">
                <form className="form-horizontal">
                    <div className={this.getFormGroupClassName('email')}>
                        <label className="col-sm-4 control-label">Email address *</label>
                        <div className="col-sm-7">
                            <input type="email" className="form-control" id="email" name="email" placeholder="Email"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('email')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <div className={this.getFormGroupClassName('street')}>
                        <label className="col-sm-4 control-label">Street *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="street" name="street" placeholder="Street"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('street')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <div className={this.getFormGroupClassName('city')}>
                        <label className="col-sm-4 control-label">City *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="city" name="city" placeholder="City"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('city')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <div className={this.getFormGroupClassName('dueDate')}>
                        <label className="col-sm-4 control-label">Due date of delivery *</label>
                        <div className="col-sm-7">
                            <input type="date" className="form-control" id="dueDate" name="dueDate"
                                   placeholder="dd/mm/yyyy"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('dueDate')} title="error"
                              style={errorIconStyle}></span>
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

CheckOut.contextTypes = {
    cart: React.PropTypes.array
};