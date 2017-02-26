import React from 'react'
import {Link} from 'react-router'
import BookInCart from './BookInCart.jsx'
import CartCommunication from './CartCommunication.jsx'

export default class CartInfo extends React.Component {
    constructor() {
        super();

        this.state = {
            columnToSort: '',
            sortByAsc: true,
            canCheckOut: false,
            localCart: CartCommunication.CurrentCart
        };
    }

    componentDidMount() {
        CartCommunication.registerCartUpdateFunc(this, CartInfo.updateLocalCart);
        CartInfo.updateLocalCart(this);
    }

    componentWillUnmount() {
        CartCommunication.unregisterCartUpdateFunc(this);
    }

    //several tasks to do here
    //1. update the current local cart, with current sort
    //2. update "check out" button state
    static updateLocalCart(currentObj) {
        let tmpCart = CartCommunication.CurrentCart;

        //if a sort has already been applied in the list
        if (currentObj.state && currentObj.state.columnToSort !== '') {
            console.log(currentObj.state);
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
            canCheckOut: tmpCanCheckOut
        });
    }

    static getWidth(widthInPercentage) {
        return {
            width: widthInPercentage + '%'
        };
    }

    sortBooks(columnName) {
        if (columnName === this.state.columnToSort) {
            this.state.localCart = _.sortBy(this.state.localCart, columnName);

            if (this.state.sortByAsc) {
                this.state.localCart = this.state.localCart.reverse();
            }

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

    static getTotalPrice() {
        let totalPrice = 0;

        if (this.state && this.state.localCart) {
            let res = Number(_.reduce(this.state.localCart, function (sum, book) {
                return sum + book.price * book.quantity;
            }, 0));

            totalPrice = res.toFixed(2);
        }

        return totalPrice;
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
                        <th style={CartInfo.getWidth(45)}
                            onClick={() => this.sortBooks("title")}>
                            Title <span className={this.getOrderIcon('title')}/>
                        </th>
                        <th style={CartInfo.getWidth(20)}>Unit Price</th>
                        <th style={CartInfo.getWidth(10)}
                            onClick={() => this.sortBooks("quantity")}>
                            Quantity <span className={this.getOrderIcon('quantity')}/>
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
                        <td colSpan="100" className="text-center">Total : {CartInfo.getTotalPrice()}</td>
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