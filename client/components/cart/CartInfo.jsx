import React from 'react'
import {Link} from 'react-router'
import BookInCart from './BookInCart.jsx'
import CartCommunicationService from '../services/Cart.communication.service.jsx'

export default class CartInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            columnToSort: '',
            sortByAsc: true,
            canCheckOut: false,
            totalPrice: 0,
            localCart: CartCommunicationService.getCart()
        };
    }

    componentDidMount() {
        CartCommunicationService.registerCartUpdateFunc(this, CartInfo.updateCart);
        CartInfo.updateCart(this);
    }

    componentWillUnmount() {
        CartCommunicationService.unregisterCartUpdateFunc(this);
    }

    //several tasks to do here
    //1. update the local cart (for current page), with the sort if any of them has been applied
    //2. update "check out" button state (cart empty or not)
    //3. update the total price
    static updateCart(currentObj) {
        let tmpCart = CartCommunicationService.getCart();

        //if a sort has already been applied in the list
        if (currentObj.state && currentObj.state.columnToSort !== '') {
            tmpCart = _.sortBy(tmpCart, currentObj.state.columnToSort);

            if (!currentObj.state.sortByAsc) {
                tmpCart = tmpCart.reverse();
            }
        }

        let tmpCanCheckOut = _.find(tmpCart, function (book) {
            return book.quantity > 0;
        });

        currentObj.setState({
            localCart: tmpCart,
            canCheckOut: tmpCanCheckOut,
            totalPrice: CartInfo.getTotalPrice(tmpCart)
        });
    }

    static getTotalPrice(cart) {
        return Number(_.reduce(cart, function (sum, book) {
            return sum + book.price * book.quantity;
        }, 0)).toFixed(2);
    }

    sortBooks(columnName) {
        if (columnName === this.state.columnToSort) {
            this.state.localCart = this.state.sortByAsc
                ? _.sortBy(this.state.localCart, columnName).reverse()
                : _.sortBy(this.state.localCart, columnName);

            this.setState({
                sortByAsc: !this.state.sortByAsc,
                localCart: this.state.localCart
            });
        } else {
            this.state.localCart = _.sortBy(this.state.localCart, columnName);

            this.setState({
                columnToSort: columnName,
                sortByAsc: true,
                localCart: this.state.localCart
            });
        }
    }

    getOrderIcon(columnNanme) {
        switch (columnNanme.toLowerCase()) {
            case 'title':
                return this.getTitleOrderIcon();
            case 'quantity':
                return this.getQuantityOrderIcon();
        }
    }

    getTitleOrderIcon() {
        if ('title' === this.state.columnToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-alphabet'
                : 'glyphicon glyphicon-sort-by-alphabet-alt';
        }

        return '';
    }

    getQuantityOrderIcon() {
        if ('quantity' === this.state.columnToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-order'
                : 'glyphicon glyphicon-sort-by-order-alt';
        }

        return '';
    }

    render() {
        let nodes;

        if (this.state.localCart && this.state.localCart.length > 0) {
            //books have been added into the cart
            nodes = this.state.localCart.map(function (book, key) {
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
                        <th style={{width: '45%'}}
                            onClick={() => this.sortBooks("title")}>
                            Title <span className={this.getOrderIcon('title')}/>
                        </th>
                        <th style={{width: '20%'}}>Unit Price</th>
                        <th style={{width: '10%'}}
                            onClick={() => this.sortBooks("quantity")}>
                            Quantity <span className={this.getOrderIcon('quantity')}/>
                        </th>
                        <th style={{width: '15%'}}>Subtotal</th>
                        <th style={{width: '10%'}}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {nodes}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="100" className="text-center">Total : {this.state.totalPrice}</td>
                    </tr>
                    </tfoot>
                </table>
                <div className="col-md-12">
                    <Link to="/checkOut">
                        <button className="btn btn-success pull-right"
                                disabled={!this.state.canCheckOut}>Check out
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}