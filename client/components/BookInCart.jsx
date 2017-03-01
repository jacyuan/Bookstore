import React from 'react'
import {Link} from 'react-router'
import AddRemoveButtons from './AddRemoveButtons.jsx'

export default class BookInCart extends React.Component {
    getTotalPrice() {
        let res = Number(this.props.book.quantity * this.props.book.price);
        return res.toFixed(2);
    }

    render() {
        return (
            <tr>
                <td>
                    <Link to={{pathname: '/bookDetail', state: {id: this.props.book.id}}}>
                        <span>{this.props.book.title}</span>
                    </Link>
                </td>
                <td>{this.props.book.price}</td>
                <td>{this.props.book.quantity}</td>
                <td>{this.getTotalPrice()}</td>
                <td><AddRemoveButtons book={this.props.book}/></td>
            </tr>
        );
    }
}
