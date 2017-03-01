import React from 'react';
import axios from 'axios'
import BookInList from './BookInList.jsx'
import {getAuthorNames} from './Helper.jsx'

export default class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            currentPage: 0,
            totalPageCount: 0,
            isLoading: true
        };
    }

    startLoading() {
        this.setState({
            isLoading: true
        });
    }

    getBooks(pageToShow = 0) {
        this.startLoading();

        let self = this;

        let url = `http://localhost:9000/books?currentPage=${pageToShow}`;

        //get all book info
        axios.get(url)
            .then(function (res) {
                let obj = res.data;

                let booksInfo = _.map(obj.results, function (book) {
                    let authors = '';
                    if (book && book.creators && book.creators.items && book.creators.items.length > 0) {
                        authors = getAuthorNames(book.creators.items);
                    }

                    return {
                        id: book.id,
                        title: book.title,
                        authors: authors,
                        thumbImg: `${book.thumbnail.path}.${book.thumbnail.extension}`,
                        pageCount: book.pageCount,
                        price: book.prices[0].price
                    };
                });

                self.setState({
                    books: booksInfo,
                    totalPageCount: Math.ceil(obj.total / 6),
                    isLoading: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentDidMount() {
        this.getBooks();
    }

    previousPage() {
        if (this.state.currentPage > 1) {
            let newCurrentPage = this.state.currentPage - 1;
            this.setState({
                currentPage: newCurrentPage,
                isLoading: true
            });

            this.getBooks(newCurrentPage);
        }
    }

    nextPage() {
        if (this.state.currentPage < this.state.totalPageCount) {
            let newCurrentPage = this.state.currentPage + 1;
            this.setState({
                currentPage: newCurrentPage,
                isLoading: true
            });

            this.getBooks(newCurrentPage);
        }
    }

    firstPage() {
        let newCurrentPage = 0;
        this.setState({
            currentPage: newCurrentPage,
            isLoading: true
        });

        this.getBooks(newCurrentPage);
    }

    lastPage() {
        let newCurrentPage = this.state.totalPageCount - 1;
        this.setState({
            currentPage: newCurrentPage,
            isLoading: true
        });

        this.getBooks(newCurrentPage);
    }

    render() {
        let nodes;
        if (this.state.isLoading) {
            nodes = (<div className='center-block uil-reload-css'>
                <div></div>
            </div>);
        } else {
            nodes = this.state.books.map(function (book, key) {
                return (
                    <BookInList key={key}
                                id={book.id}
                                title={book.title}
                                authors={book.authors}
                                pageCount={book.pageCount}
                                price={book.price}
                                thumbImg={book.thumbImg}>
                    </BookInList>
                );
            });
        }

        return (
            <div className="row">
                {nodes}

                { this.state.isLoading
                    ? null
                    : (
                        <div className="text-center">
                            <button className="btn btn-link"
                                    onClick={() => this.firstPage()}
                                    disabled={this.state.currentPage === 0}>
                                <span className="glyphicon glyphicon-fast-backward"/>
                            </button>
                            <button className="btn btn-link"
                                    onClick={() => this.previousPage()}
                                    disabled={this.state.currentPage === 0}>
                                <span className="glyphicon glyphicon-backward"/>
                            </button>

                            Page : {this.state.currentPage + 1} / {this.state.totalPageCount}

                            <button className="btn btn-link"
                                    onClick={() => this.nextPage()}
                                    disabled={this.state.currentPage + 1 === this.state.totalPageCount}>
                                <span className="glyphicon glyphicon-forward"/>
                            </button>
                            <button className="btn btn-link"
                                    onClick={() => this.lastPage()}
                                    disabled={this.state.currentPage + 1 === this.state.totalPageCount}>
                                <span className="glyphicon glyphicon-fast-forward"/>
                            </button>
                        </div>
                    )
                }
            </div>
        );
    }
}
