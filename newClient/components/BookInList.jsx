import React from 'react';
import {Link} from 'react-router';
import AddRemoveButtons from './AddRemoveButtons.jsx'

export default class BookInList extends React.Component {
    render() {
        let book = {
            id: this.props.id,
            title: this.props.title,
            author: this.props.authors,
            thumbImg: this.props.thumbImg,
            pageCount: this.props.pageCount,
            price: this.props.price
        };

        return (
            <div className="col-md-6" style={{margin: '0 0 5px', height: '350px'}}>
                <div className="col-md-5">
                    <Link to={{pathname: '/bookDetail', state: {id: this.props.id}}}>
                        <img src={this.props.thumbImg} style={{width: '100%'}}/>
                    </Link>
                </div>

                <div className="col-md-7">
                    <p>{this.props.title}</p>
                    <p>{this.props.authors}</p>
                    <p>{this.props.pageCount} pages</p>
                    <AddRemoveButtons book={book}/>
                </div>
            </div>
        );
    }
}