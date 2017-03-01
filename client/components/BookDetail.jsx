import React from 'react';
import axios from 'axios'
import AddRemoveButtons from './AddRemoveButtons.jsx'

export default class BookDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            book: {},
            isLoading: false
        };
    }

    static getAuthorNames(authors) {
        let authorNames = _.reduce(authors,
            function (res, author) {
                return res + author.name + ', ';
            }, '');

        authorNames = authorNames.substr(0, authorNames.lastIndexOf(', '));

        return authorNames;
    }

    componentDidMount() {
        this.setState({isLoading: true});

        let bookId = this.props.location.state.id;
        let self = this;

        let url = 'http://localhost:9000/books/' + bookId;

        //get book info
        //titre, image, description, nbr page, nom créateur, nom séries
        axios.get(url).then(function (res) {
            let data = res.data.results[0];

            let authors = '';

            if (data.creators && data.creators.items && data.creators.items.length > 0) {
                authors = BookDetail.getAuthorNames(data.creators.items);
            }

            let imageUrl = '';

            if (data.images.length > 0) {
                imageUrl = data.images[0].path + '.' + data.images[0].extension;
            } else {
                imageUrl = data.thumbnail.path + '.' + data.thumbnail.extension;
            }

            let price = data.prices[0].price;

            let book = {
                id: data.id,
                title: data.title,
                image: imageUrl,
                description: data.description,
                pageCount: data.pageCount,
                authors: authors,
                serie: data.series.name,
                price: price
            };

            self.setState({
                book: book,
                isLoading: false
            });
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        let node;
        if (this.state.isLoading) {
            node = (<div className='center-block uil-reload-css'>
                <div></div>
            </div>);
        } else {
            node = (<div>
                <img className="col-md-5" src={this.state.book.image}/>
                <div className="col-md-offset-1 col-md-6">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label className="col-sm-4 control-label">Title</label>
                            <div className="col-sm-8">
                                <p className="form-control-static">{this.state.book.title}</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-4 control-label">Authors</label>
                            <div className="col-sm-8">
                                <p className="form-control-static">{this.state.book.authors}</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-4 control-label">Series</label>
                            <div className="col-sm-8">
                                <p className="form-control-static">{this.state.book.serie}</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-4 control-label">Description</label>
                            <div className="col-sm-8">
                                <p className="form-control-static">{this.state.book.description}</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-4 control-label">Page count</label>
                            <div className="col-sm-8">
                                <p className="form-control-static">{this.state.book.pageCount}</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-sm-4 control-label">Price</label>
                            <div className="col-sm-8">
                                <p className="form-control-static">{this.state.book.price}</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-4 col-sm-8">
                                <AddRemoveButtons book={this.state.book}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>);
        }

        return (
            <div className="row">
                {node}
            </div>
        );
    }
}