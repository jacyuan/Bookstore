import React from 'react'
import CartCommunicationService from './services/Cart.communication.service.jsx'

//add/remove buttons reusable for several pages
export default class AddRemoveButtons extends React.Component {
    static add(book) {
        let currentBook = _.find(CartCommunicationService.CurrentCart, {id: book.id});

        if (currentBook) {
            currentBook.quantity++;
        } else {
            let newBook = Object.assign({quantity: 1}, book);
            CartCommunicationService.CurrentCart.push(newBook);
        }

        CartCommunicationService.raiseCartUpdatedEvent();
    }

    static remove(book) {
        let currentBook = _.find(CartCommunicationService.CurrentCart, {id: book.id});

        if (currentBook) {
            if (currentBook.quantity > 1) {
                currentBook.quantity--;
            } else {
                CartCommunicationService.CurrentCart = _.reject(CartCommunicationService.CurrentCart, {id: book.id});
            }
        }

        CartCommunicationService.raiseCartUpdatedEvent();
    }

    render() {
        return (
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-default" title="Add to cart"
                        onClick={() => AddRemoveButtons.add(this.props.book)}>
                    <span className="glyphicon glyphicon-plus"/>
                </button>
                <button type="button" className="btn btn-default" title="Remove from cart"
                        onClick={() => AddRemoveButtons.remove(this.props.book)}>
                    <span className="glyphicon glyphicon-minus"/>
                </button>
            </div>
        );
    }
}