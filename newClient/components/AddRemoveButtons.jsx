import React from 'react'
import CartCommunication from './CartCommunication.jsx'

export default class AddRemoveButtons extends React.Component {
    static add(book) {
        let currentBook = _.find(CartCommunication.CurrentCart, {id: book.id});

        if (currentBook) {
            currentBook.quantity++;
        } else {
            let newBook = Object.assign({quantity: 1}, book);
            CartCommunication.CurrentCart.push(newBook);
        }

        CartCommunication.raiseCartUpdatedEvent();
    }

    static remove(book) {
        let currentBook = _.find(CartCommunication.CurrentCart, {id: book.id});

        if (currentBook) {
            if (currentBook.quantity > 1) {
                currentBook.quantity--;
            } else {
                CartCommunication.CurrentCart = _.reject(CartCommunication.CurrentCart, {id: book.id});
            }
        }

        CartCommunication.raiseCartUpdatedEvent();
    }

    render() {
        return (
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-default" title="Add to cart"
                        onClick={() => AddRemoveButtons.add(this.props.book)}>
                    <span className="glyphicon glyphicon-plus"></span>
                </button>
                <button type="button" className="btn btn-default" title="Remove from cart"
                        onClick={() => AddRemoveButtons.remove(this.props.book)}>
                    <span className="glyphicon glyphicon-minus"></span>
                </button>
            </div>
        );
    }
}