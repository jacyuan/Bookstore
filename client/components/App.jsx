import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Link, browserHistory} from 'react-router';
import BookList from './BookList.jsx'
import CartInfo from './CartInfo.jsx'
import CheckOut from './CheckOut.jsx'
import BookDetail from './BookDetail.jsx'
import CartCommunication from './CartCommunication.jsx'
import AlertCommunicationService from './AlertCommunicationService.jsx'
import {ToastContainer, ToastMessage} from 'react-toastr'

const ToastMessageFactory = React.createFactory(ToastMessage.animation);

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            bookCount: 0
        };
    }

    componentDidMount() {
        CartCommunication.registerCartUpdateFunc(this, App.updateBookCount);
        AlertCommunicationService.registerShowAlertFunc(this, App.addAlert);
    }

    componentWillUnmount() {
        CartCommunication.unregisterCartUpdateFunc(this);
        AlertCommunicationService.unregisterShowAlertFunc();
    }

    static updateBookCount(currentObject) {
        let quantityInfo = _.values(_.pluck(CartCommunication.CurrentCart, 'quantity'));

        let count = _.reduce(quantityInfo, function (sum, quantity) {
            return sum + quantity;
        }, 0);

        currentObject.setState({
            bookCount: count
        });
    }

    static addAlert(currentObject, msg, type) {
        switch (type) {
            case 'error':
                currentObject.refs.container.error(msg, '', {timeOut: 3000});
                break;
            case 'success':
                currentObject.refs.container.success(msg, '', {timeOut: 3000});
                break;
        }
    }

    render() {
        return (
            <div>
                <ToastContainer
                    toastMessageFactory={ToastMessageFactory}
                    ref="container"
                    className="toast-top-right"/>

                <h1 className="text-center">Book store</h1>
                <ul className="pull-right list-inline">
                    <li>
                        <Link to="/bookList">Book list</Link>
                    </li>
                    <li> |</li>
                    <li>
                        <Link to="/cartInfo">
                            <button className="btn btn-primary" type="button">
                                <span className="glyphicon glyphicon-shopping-cart"></span>
                                <span className="badge">{this.state.bookCount}</span>
                            </button>
                        </Link>
                    </li>
                </ul>
                <br/>
                <br/>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const app = document.getElementById('content');

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path={"/"} component={App}>
            <IndexRoute component={BookList}/>
            <Route path={"bookList"} component={BookList}/>
            <Route path={"cartInfo"} component={CartInfo}/>
            <Route path={"checkOut"} component={CheckOut}/>
            <Route path={"bookDetail"} component={BookDetail}/>
        </Route>
    </Router>,
    app
);