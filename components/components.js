let {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    Link
} = ReactRouter;

let App = React.createClass({
    getInitialState: function () {
        return {
            cart: []
        }
    },
    getBooksCount: function () {
        let quantityInfo = _.values(_.pluck(this.state.cart, 'quantity'));

        return _.reduce(quantityInfo, function (sum, quantity) {
            return sum + quantity;
        }, 0);
    },
    addToCart: function (book) {
        let tmpCart = this.state.cart;
        let currentBook = _.find(tmpCart, {id: book.id});

        if (currentBook) {
            currentBook.quantity++;
        } else {
            let newBook = Object.assign({quantity: 1}, book);
            tmpCart.push(newBook);
        }

        this.setState({
            cart: tmpCart
        });
    },
    removeFromCart: function (book) {
        let tmpCart = this.state.cart;
        let currentBook = _.find(tmpCart, {id: book.id});

        if (currentBook) {
            if (currentBook.quantity > 1) {
                currentBook.quantity--;
            } else {
                tmpCart = _.reject(tmpCart, {id: book.id});
            }
        }

        this.setState({
            cart: tmpCart
        });
    },
    getChildContext() {
        return {
            cart: this.state.cart,
            addToCart: this.addToCart,
            removeFromCart: this.removeFromCart,
        };
    },
    render: function () {
        return (
            <div>
                <h1 className="text-center">Book store</h1>
                <ul className="pull-right list-inline">
                    <li>
                        <Link to="/bookList">Book list</Link>
                    </li>
                    <li> |</li>
                    <li>
                        <Link to="/cartInfo">Cart ({this.getBooksCount()} book(s) added)</Link>
                    </li>
                </ul>
                <br/>
                <br/>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

App.childContextTypes = {
    cart: React.PropTypes.array,
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

let BookList = React.createClass({
    getInitialState: function () {
        return {
            books: []
        };
    },

    getAuthorNames: function (authors) {
        let authorNames = _.reduce(authors,
            function (res, author) {
                return res + author.name + ', ';
            }, '');

        authorNames = authorNames.substr(0, authorNames.lastIndexOf(', '));

        return authorNames;
    },

    componentDidMount: function () {
        let self = this;

        let publicKey = 'f63548d029560ca6297df5eab0ce1184';
        let privateKey = '21fb208a38c9feaf9e8a043d0f6276eba10784e7';

        let ts = new Date().getTime();

        let hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

        let url = 'http://gateway.marvel.com:80/v1/public/comics?limit=6&offset=0&apikey=' + publicKey;

        url += '&ts=' + ts + '&hash=' + hash;

        //get all book info
        $.get(url, function (res) {
            let booksInfo = _.map(res.data.results, function (book) {
                let authors = '';

                if (book && book.creators && book.creators.items && book.creators.items.length > 0) {
                    authors = self.getAuthorNames(book.creators.items);
                }

                let thumbImg = book.thumbnail.path + '.' + book.thumbnail.extension;

                let price = book.prices[0].price;

                return {
                    id: book.id,
                    title: book.title,
                    authors: authors,
                    thumbImg: thumbImg,
                    pageCount: book.pageCount,
                    price: price
                };
            });

            self.setState({
                books: booksInfo
            });
        });
    },

    render: function () {
        const nodes = this.state.books.map(function (book, key) {
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

        return (
            <div className="row">
                {nodes}
            </div>
        );
    }
});

let BookInList = React.createClass({
    addBook: function (item) {
        this.context.addToCart(item);
    },
    removeBook: function (item) {
        this.context.removeFromCart(item);
    },
    render: function () {
        const imgStyle = {
            width: '100%'
        };
        const marginBottom5 = {
            margin: '0 0 5px'
        };

        let book = {
            id: this.props.id,
            title: this.props.title,
            author: this.props.authors,
            thumbImg: this.props.thumbImg,
            pageCount: this.props.pageCount,
            price: this.props.price
        };

        return (
            <div className="col-md-4" style={marginBottom5}>
                <div className="col-md-5">
                    <Link to={{pathname: '/bookDetail', state: {id: this.props.id}}}>
                        <img src={this.props.thumbImg} style={imgStyle}/>
                    </Link>
                </div>

                <div className="col-md-7">
                    <p style={marginBottom5}>{this.props.title}</p>
                    <p style={marginBottom5}>{this.props.authors}</p>
                    <p style={marginBottom5}>{this.props.pageCount} pages</p>
                    <AddRemoveButtons book={book}/>
                </div>
            </div>
        );
    }
});

BookInList.contextTypes = {
    cart: React.PropTypes.array,
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

let BookDetail = React.createClass({
    getInitialState: function () {
        return {
            book: {}
        };
    },
    getAuthorNames: function (authors) {
        let authorNames = _.reduce(authors,
            function (res, author) {
                return res + author.name + ', ';
            }, '');

        authorNames = authorNames.substr(0, authorNames.lastIndexOf(', '));

        return authorNames;
    },
    componentDidMount: function () {
        let bookId = this.props.location.state.id;
        let self = this;

        let publicKey = 'f63548d029560ca6297df5eab0ce1184';
        let privateKey = '21fb208a38c9feaf9e8a043d0f6276eba10784e7';

        let ts = new Date().getTime();

        let hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

        let url = 'http://gateway.marvel.com:80/v1/public/comics/' + bookId + '?apikey=' + publicKey;

        url += '&ts=' + ts + '&hash=' + hash;

        //get book info
        //titre, image, description, nbr page, nom créateur, nom séries
        $.get(url, function (res) {
            if (res && res.data && res.data.results.length > 0) {
                let data = res.data.results[0];

                let authors = '';

                if (data.creators && data.creators.items && data.creators.items.length > 0) {
                    authors = self.getAuthorNames(data.creators.items);
                }

                let imageUrl = data.images[0].path + '.' + data.images[0].extension;
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
                    book: book
                });
            }
        });
    },
    render: function () {
        return (
            <div className="row">
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
                            <div className="col-sm-12">
                                <AddRemoveButtons book={this.state.book}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});

let CartInfo = React.createClass({
    render: function () {
        let nodes;

        if (this.context.cart && this.context.cart.length > 0) {
            //books have been added into the cart
            nodes = this.context.cart.map(function (book, key) {
                return (
                    <BookInCart key={key} book={book}>
                    </BookInCart>
                );
            });
        } else {
            //nothing inside the cart
            nodes = <h3 className="text-center">Your cart is empty</h3>;
        }

        return (
            <div className="row">
                {nodes}
            </div>
        );
    }
});

CartInfo.contextTypes = {
    cart: React.PropTypes.array
};

let BookInCart = React.createClass({
    render: function () {
        return (
            <div className="row">
                <div className="col-md-3">
                    <span>Title : {this.props.book.title}</span>
                </div>
                <div className="col-md-2">
                    <span>Price : {this.props.book.price}</span>
                </div>
                <div className="col-md-5">
                    <span className="col-md-offset-4 col-md-4">Quantity : {this.props.book.quantity} </span>
                    <AddRemoveButtons book={this.props.book}/>
                </div>
                <div className="col-md-2">
                    <span>Total : {this.props.book.quantity * this.props.book.price}</span>
                </div>
            </div>
        );
    }
});

BookInCart.contextTypes = {
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

let AddRemoveButtons = React.createClass({
    add: function (book) {
        this.context.addToCart(book);
    },
    remove: function (book) {
        this.context.removeFromCart(book);
    },
    render: function () {
        return (
            <div>
                <a className="btn btn-default" role="button" title="Add to cart"
                   onClick={() => this.add(this.props.book)}>
                    <span className="glyphicon glyphicon-plus"></span>
                </a>
                <a className="btn btn-default" role="button" title="Remove from cart"
                   onClick={() => this.remove(this.props.book)}>
                    <span className="glyphicon glyphicon-minus"></span>
                </a>
            </div>
        );
    }
});

AddRemoveButtons.contextTypes = {
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={BookList}/>
            <Route path="bookList" component={BookList}/>
            <Route path="cartInfo" component={CartInfo}/>
            <Route path="/bookDetail" component={BookDetail}/>
        </Route>
    </Router>,
    document.getElementById('content')
);