import React from 'react'
import {Link} from 'react-router'
import BookInCart from './BookInCart.jsx'
import CartCommunication from './CartCommunication.jsx'

export default class CartInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            coloneToSort: '',
            sortByAsc: true
        };
    }

    static getWidth(widthInPercentage) {
        return {
            width: widthInPercentage + '%'
        };
    }

    static canCheckOut() {
        return _.find(CartCommunication.CurrentCart, function (book) {
            return book.quantity > 0;
        });
    }

    sortBooks(coloneName) {
        if (coloneName === this.state.coloneToSort) {

            if (this.state.sortByAsc) {
                CartCommunication.CurrentCart = _.sortBy(CartCommunication.CurrentCart, coloneName).reverse();
            } else {
                CartCommunication.CurrentCart = _.sortBy(CartCommunication.CurrentCart, coloneName);
            }

            this.setState({
                sortByAsc: !this.state.sortByAsc
            });
        } else {
            this.setState({
                coloneToSort: coloneName,
                sortByAsc: true
            });

            CartCommunication.CurrentCart = _.sortBy(CartCommunication.CurrentCart, coloneName);
        }
    }

    getOrderIcon(coloneNanme) {
        switch (coloneNanme.toLowerCase()) {
            case 'title':
                return this.getTitleOrderIcon();
            case 'quantity':
                return this.getQuantityOrderIcon();
        }
    }

    getTitleOrderIcon() {
        if ('title' === this.state.coloneToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-alphabet'
                : 'glyphicon glyphicon-sort-by-alphabet-alt';
        }

        return '';
    }

    getQuantityOrderIcon() {
        if ('quantity' === this.state.coloneToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-order'
                : 'glyphicon glyphicon-sort-by-order-alt';
        }

        return '';
    }

    getTotalPrice() {
        let res = Number(_.reduce(CartCommunication.CurrentCart, function (sum, book) {
            return sum + book.price * book.quantity;
        }, 0));

        return res.toFixed(2);
    }

    render() {
        let nodes;

        if (CartCommunication.CurrentCart && CartCommunication.CurrentCart.length > 0) {
            //books have been added into the cart
            nodes = CartCommunication.CurrentCart.map(function (book, key) {
                return (
                    <BookInCart key={key} book={book}>
                    </BookInCart>
                );
            });
        } else {
            //nothing inside the cart
            nodes = <tr>
                <td colSpan="100" className="text-center">Your cart is empty</td>
            </tr>;
        }

        return (
            <div>
                <table className="table table-bordered table-hover col-md-10">
                    <thead>
                    <tr>
                        <th style={CartInfo.getWidth(45)}
                            onClick={() => this.sortBooks("title")}>
                            Title <span className={this.getOrderIcon('title')}></span>
                        </th>
                        <th style={CartInfo.getWidth(20)}>Unit Price</th>
                        <th style={CartInfo.getWidth(10)}
                            onClick={() => this.sortBooks("quantity")}>
                            Quantity <span className={this.getOrderIcon('quantity')}></span>
                        </th>
                        <th style={CartInfo.getWidth(15)}>Subtotal</th>
                        <th style={CartInfo.getWidth(10)}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {nodes}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="100" className="text-center">Total : {this.getTotalPrice()}</td>
                    </tr>
                    </tfoot>
                </table>
                <div className="col-md-12">
                    <Link to="/checkOut">
                        <button className="btn btn-success pull-right"
                                disabled={!CartInfo.canCheckOut()}>Check out
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}

CartInfo.contextTypes = {
    cart: React.PropTypes.array,
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

