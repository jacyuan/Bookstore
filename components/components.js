let {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    Link
} = ReactRouter;

//region main
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
            removeFromCart: this.removeFromCart
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
                        <Link to="/cartInfo">
                            <button className="btn btn-primary" type="button">
                                <span className="glyphicon glyphicon-shopping-cart"></span>
                                <span className="badge">{this.getBooksCount()}</span>
                            </button>
                        </Link>
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
//endregion

//region book list
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
        const bookStyle = {
            margin: '0 0 5px',
            height: '350px'
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
            <div className="col-md-6" style={bookStyle}>
                <div className="col-md-5">
                    <Link to={{pathname: '/bookDetail', state: {id: this.props.id}}}>
                        <img src={this.props.thumbImg} style={imgStyle}/>
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
});

BookInList.contextTypes = {
    cart: React.PropTypes.array,
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};
//endregion

//region book detail
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
                            <div className="col-sm-offset-4 col-sm-8">
                                <AddRemoveButtons book={this.state.book}/>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
});
//endregion

//region cart info
let CartInfo = React.createClass({
    getInitialState: function () {
        return {
            coloneToSort: '',
            sortByAsc: true
        };
    },
    getWidth: function (widthInPercentage) {
        return {
            width: widthInPercentage + '%'
        };
    },
    canCheckOut: function () {
        if (this.context.cart) {
            return _.find(this.context.cart, function (book) {
                return book.quantity > 0;
            });
        }

        return false;
    },
    checkOut: function () {
        if (this.canCheckOut()) {

        }
    },
    sortBooks: function (coloneName) {
        if (coloneName === this.state.coloneToSort) {

            if (this.state.sortByAsc) {
                this.context.cart = _.sortBy(this.context.cart, coloneName).reverse();
            } else {
                this.context.cart = _.sortBy(this.context.cart, coloneName);
            }

            this.setState({
                sortByAsc: !this.state.sortByAsc
            });
        } else {
            this.setState({
                coloneToSort: coloneName,
                sortByAsc: true
            });

            this.context.cart = _.sortBy(this.context.cart, coloneName);
        }
    },
    getOrderIcon: function (coloneNanme) {
        switch (coloneNanme.toLowerCase()) {
            case 'title':
                return this.getTitleOrderIcon();
            case 'quantity':
                return this.getQuantityOrderIcon();
        }
    },
    getTitleOrderIcon: function () {
        if ('title' === this.state.coloneToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-alphabet'
                : 'glyphicon glyphicon-sort-by-alphabet-alt';
        }

        return '';
    },
    getQuantityOrderIcon: function () {
        if ('quantity' === this.state.coloneToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-order'
                : 'glyphicon glyphicon-sort-by-order-alt';
        }

        return '';
    },
    getTotalPrice: function () {
        let res = Number(_.reduce(this.context.cart, function (sum, book) {
            return sum + book.price * book.quantity;
        }, 0));

        return res.toFixed(2);
    },
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
            nodes = <tr>
                <td colSpan="100" className="text-center">Your cart is empty</td>
            </tr>;
        }

        return (
            <div>
                <table className="table table-bordered table-hover col-md-10">
                    <thead>
                    <tr>
                        <th style={this.getWidth(45)}
                            onClick={() => this.sortBooks("title")}>
                            Title <span className={this.getOrderIcon('title')}></span>
                        </th>
                        <th style={this.getWidth(20)}>Unit Price</th>
                        <th style={this.getWidth(10)}
                            onClick={() => this.sortBooks("quantity")}>
                            Quantity <span className={this.getOrderIcon('quantity')}></span>
                        </th>
                        <th style={this.getWidth(15)}>Subtotal</th>
                        <th style={this.getWidth(10)}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {nodes}
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan="100" className="text-center">Total : {this.getTotalPrice()}</td>
                    </tr>
                    </tfoot>
                </table>
                <div className="col-md-12">
                    <Link to="/checkOut">
                        <button className="btn btn-success pull-right"
                                onClick={() => this.checkOut()}
                                disabled={!this.canCheckOut()}>Check out
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
});

CartInfo.contextTypes = {
    cart: React.PropTypes.array,
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

//endregion

//region book in cart
let BookInCart = React.createClass({
    getTotalPrice: function () {
        let res = Number(this.props.book.quantity * this.props.book.price);
        return res.toFixed(2);
    },
    render: function () {
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
});

BookInCart.contextTypes = {
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};

//endregion

//region checkout
let CheckOut = React.createClass({
    getInitialState: function () {
        return {};
    },
    render: function () {
        return (<div>TODO</div>);
    }
});
//endregion

//region add/remove buttons
let AddRemoveButtons = React.createClass({
    add: function (book) {
        this.context.addToCart(book);
    },
    remove: function (book) {
        this.context.removeFromCart(book);
    },
    render: function () {
        return (
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-default" title="Add to cart"
                        onClick={() => this.add(this.props.book)}>
                    <span className="glyphicon glyphicon-plus"></span>
                </button>
                <button type="button" className="btn btn-default" title="Remove from cart"
                        onClick={() => this.remove(this.props.book)}>
                    <span className="glyphicon glyphicon-minus"></span>
                </button>
            </div>
        );
    }
});

AddRemoveButtons.contextTypes = {
    addToCart: React.PropTypes.func,
    removeFromCart: React.PropTypes.func
};
//endregion

ReactDOM.render(
    <Router>
        <Route path="/" component={App}>
            <IndexRoute component={BookList}/>
            <Route path="bookList" component={BookList}/>
            <Route path="cartInfo" component={CartInfo}/>
            <Route path="checkOut" component={CheckOut}/>
            <Route path="/bookDetail" component={BookDetail}/>
        </Route>
    </Router>,
    document.getElementById('content')
);