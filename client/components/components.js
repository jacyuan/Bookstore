let {
    Router,
    Route,
    IndexRoute,
    Link,
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
    render () {
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
            books: [],
            currentPage: 0,
            totalPageCount: 0,
            isLoading: true
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
    getBooks: function (pageToShow = 0) {
        this.setState({
            isLoading: true
        });

        let self = this;

        let url = 'http://localhost:9000/books?currentPage=' + pageToShow;

        //get all book info
        axios.get(url)
            .then(function (res) {
                let obj = res.data;

                let booksInfo = _.map(obj.results, function (book) {
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

                let totalBookCount = obj.total;

                self.setState({
                    books: booksInfo,
                    totalPageCount: Math.ceil(totalBookCount / 6),
                    isLoading: false
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    componentDidMount: function () {
        this.getBooks();
    },
    previousPage: function () {
        if (this.state.currentPage > 1) {
            let newCurrentPage = this.state.currentPage - 1;
            this.setState({
                currentPage: newCurrentPage,
                isLoading: true
            });

            this.getBooks(newCurrentPage);
        }
    },
    nextPage: function () {
        if (this.state.currentPage < this.state.totalPageCount) {
            let newCurrentPage = this.state.currentPage + 1;
            this.setState({
                currentPage: newCurrentPage,
                isLoading: true
            });

            this.getBooks(newCurrentPage);
        }
    },
    firstPage: function () {
        let newCurrentPage = 0;
        this.setState({
            currentPage: newCurrentPage,
            isLoading: true
        });

        this.getBooks(newCurrentPage);
    },
    lastPage: function () {
        let newCurrentPage = this.state.totalPageCount - 1;
        this.setState({
            currentPage: newCurrentPage,
            isLoading: true
        });

        this.getBooks(newCurrentPage);
    },
    render () {
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
                                <span className="glyphicon glyphicon-fast-backward"></span>
                            </button>
                            <button className="btn btn-link"
                                    onClick={() => this.previousPage()}
                                    disabled={this.state.currentPage === 0}>
                                <span className="glyphicon glyphicon-backward"></span>
                            </button>

                            Page : {this.state.currentPage + 1} / {this.state.totalPageCount}

                            <button className="btn btn-link"
                                    onClick={() => this.nextPage()}
                                    disabled={this.state.currentPage + 1 === this.state.totalPageCount}>
                                <span className="glyphicon glyphicon-forward"></span>
                            </button>
                            <button className="btn btn-link"
                                    onClick={() => this.lastPage()}
                                    disabled={this.state.currentPage + 1 === this.state.totalPageCount}>
                                <span className="glyphicon glyphicon-fast-forward"></span>
                            </button>
                        </div>
                    )
                }
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
    render () {
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
            book: {},
            isLoading: false
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
                authors = self.getAuthorNames(data.creators.items);
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
    },
    render () {
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
});
//endregion

//region cart info
let CartInfo = React.createClass({
    getInitialState: function () {
        return {
            columnToSort: '',
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
    sortBooks: function (coloneName) {
        if (coloneName === this.state.columnToSort) {

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
                columnToSort: coloneName,
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
        if ('title' === this.state.columnToSort) {
            return this.state.sortByAsc
                ? 'glyphicon glyphicon-sort-by-alphabet'
                : 'glyphicon glyphicon-sort-by-alphabet-alt';
        }

        return '';
    },
    getQuantityOrderIcon: function () {
        if ('quantity' === this.state.columnToSort) {
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
    render() {
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
    render () {
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
        return {
            errorElements: {
                email: false,
                street: false,
                city: false,
                dueDate: false
            },
            personalInfo: {
                email: '',
                street: '',
                city: '',
                dueDate: ''
            }
        };
    },
    handleInputChange: function (event) {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        let tmpPersoInfo = this.state.personalInfo;
        tmpPersoInfo[name] = value;

        this.setState({
            personalInfo: tmpPersoInfo
        });
    },
    checkOut: function () {
        let url = 'http://localhost:9000/carts';

        let data = {
            cart: this.context.cart,
            personalInfo: this.state.personalInfo
        };

        axios.post(url, data)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    getFormGroupClassName(eleName){
        if (this.state.errorElements && this.state.errorElements[eleName]) {
            return 'form-group has-error';
        }

        return 'form-group';
    },
    getErrorIconClassName(eleName){
        if (this.state.errorElements && this.state.errorElements[eleName]) {
            return 'col-sm-1 btn glyphicon glyphicon-exclamation-sign';
        }

        return '';
    },
    render () {
        let books = this.context.cart.map(function (book, key) {
            return (
                <div className="form-group" key={key}>
                    <label className="col-sm-8 control-label">{book.title}</label>
                    <div className="col-sm-2">
                        <p className="form-control-static">{book.quantity}</p>
                    </div>
                </div>
            );
        });

        let errorIconStyle = {
            color: '#a94442'
        };

        return (
            <div className="col-md-offset-2 col-md-8">
                <form className="form-horizontal">
                    <div className={this.getFormGroupClassName('email')}>
                        <label className="col-sm-4 control-label">Email address *</label>
                        <div className="col-sm-7">
                            <input type="email" className="form-control" id="email" name="email" placeholder="Email"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('email')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <div className={this.getFormGroupClassName('street')}>
                        <label className="col-sm-4 control-label">Street *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="street" name="street" placeholder="Street"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('street')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <div className={this.getFormGroupClassName('city')}>
                        <label className="col-sm-4 control-label">City *</label>
                        <div className="col-sm-7">
                            <input type="text" className="form-control" id="city" name="city" placeholder="City"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('city')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <div className={this.getFormGroupClassName('dueDate')}>
                        <label className="col-sm-4 control-label">Due date of delivery *</label>
                        <div className="col-sm-7">
                            <input type="date" className="form-control" id="dueDate" name="dueDate"
                                   placeholder="dd/mm/yyyy"
                                   onChange={this.handleInputChange}/>
                        </div>
                        <span className={this.getErrorIconClassName('dueDate')} title="error"
                              style={errorIconStyle}></span>
                    </div>
                    <br/>
                    {books}
                </form>

                <br/>

                <button type="button" className="col-md-3 pull-right btn btn-default"
                        onClick={() => this.checkOut()}>
                    Check out
                </button>
            </div>
        );
    }
});

CheckOut.contextTypes = {
    cart: React.PropTypes.array
};
//endregion

//region add/remove buttons
let AddRemoveButtons = React.createClass({
    add: function (book) {
        this.context.addToCart(book);
    },
    remove: function (book) {
        this.context.removeFromCart(book);
    },
    render () {
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
            <Route path="/bookList" component={BookList}/>
            <Route path="/cartInfo" component={CartInfo}/>
            <Route path="/checkOut" component={CheckOut}/>
            <Route path="/bookDetail" component={BookDetail}/>
        </Route>
    </Router>
    ,
    document.getElementById('content')
);