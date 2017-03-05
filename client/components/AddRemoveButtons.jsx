import React from 'react'
import CartCommunicationService from './services/Cart.communication.service.jsx'

//add/remove buttons reusable for several pages
export default class AddRemoveButtons extends React.Component {
    static add(book) {
        let tmpCart = CartCommunicationService.getCart();

        let currentBook = _.find(tmpCart, {id: book.id});

        if (currentBook) {
            currentBook.quantity++;
        } else {
            let newBook = Object.assign({quantity: 1}, book);
            tmpCart.push(newBook);
        }

        CartCommunicationService.setCart(tmpCart);
    }

    static remove(book) {
        let tmpCart = CartCommunicationService.getCart();

        let currentBook = _.find(tmpCart, {id: book.id});

        if (currentBook) {
            if (currentBook.quantity > 1) {
                currentBook.quantity--;
            } else {
                tmpCart=_.reject(tmpCart, {id: book.id});
            }

            CartCommunicationService.setCart(tmpCart);
        }
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