import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Link, hashHistory} from 'react-router';

import BookList from './BookList.jsx'
import CartInfo from './CartInfo.jsx'
import CheckOut from './CheckOut.jsx'
import BookDetail from './BookDetail.jsx'
import CartCommunication from './CartCommunication.jsx'

export default class App extends React.Component {

    constructor() {
        super();

        this.state = {
            bookCount: 0
        };

        CartCommunication.registerCartUpdateFunc(this, this.updateBookCount);
    }

    updateBookCount(test) {
        let quantityInfo = _.values(_.pluck(CartCommunication.CurrentCart, 'quantity'));

        let count = _.reduce(quantityInfo, function (sum, quantity) {
            return sum + quantity;
        }, 0);

        test.setState({
            bookCount: count
        });
    }

    render() {
        return (
            <div>
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
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={BookList}/>
            <Route path="/bookList" component={BookList}/>
            <Route path="/cartInfo" component={CartInfo}/>
            <Route path="/checkOut" component={CheckOut}/>
            <Route path="/bookDetail" component={BookDetail}/>
        </Route>
    </Router>
    ,
    app
);