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
    getChildContext() {
        return {
            cart: [
                {
                    name: "yuan LIN 1",
                    quantity: 1,
                    price: 10
                },
                {
                    name: "yuan LIN 1",
                    quantity: 1,
                    price: 10
                },
                {
                    name: "yuan LIN 1",
                    quantity: 1,
                    price: 10
                },
                {
                    name: "yuan LIN 1",
                    quantity: 1,
                    price: 10
                },
                {
                    name: "yuan LIN 1",
                    quantity: 1,
                    price: 10
                }
            ]
        };
    },
    render: function () {
        return (
            <div>
                <h1 className="text-center">Book store</h1>
                <ul className="pull-right list-inline">
                    <li><Link to="/bookList">Liste</Link></li>
                    <li><Link to="/cartInfo">Panier</Link></li>
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
    cart: React.PropTypes.array
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

        let url = "http://gateway.marvel.com:80/v1/public/comics?limit=6&offset=0&apikey=" + publicKey;

        url += "&ts=" + ts + "&hash=" + hash;

        //get all book info
        $.get(url, function (res) {
            let booksInfo = _.map(res.data.results, function (book) {
                let authors = '';

                if (book.creators && book.creators && book.creators.items.length > 0) {
                    authors = self.getAuthorNames(book.creators.items);
                }

                let thumbImg = book.thumbnail.path + '.' + book.thumbnail.extension;

                return {
                    name: book.title,
                    author: authors,
                    thumbImg: thumbImg,
                    pageCount: book.pageCount
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
                <BookInList key={key} name={book.name} author={book.author} pageCount={book.pageCount}
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
    render: function () {
        const imgStyle = {
            width: '100%'
        };
        const marginBottom5 = {
            margin: '0 0 5px'
        };

        return (

            <div className="col-md-4" style={marginBottom5}>
                <Link to="/bookDetail">
                    <div className="col-md-5">
                        <img src={this.props.thumbImg} style={imgStyle}/>
                    </div>
                </Link>

                <div className="col-md-7">
                    <p style={marginBottom5}>{this.props.name}</p>
                    <p style={marginBottom5}>{this.props.author}</p>
                    <p style={marginBottom5}>{this.props.pageCount} pages</p>
                    <p style={marginBottom5}>... ...</p>
                </div>
            </div>
        );
    }
});

let BookDetail = React.createClass({
    render: function () {
        return (
            <div>
                {/*todo*/}
                book info to complete
            </div>
        );
    }
});

let CartInfo = React.createClass({
    // getInitialState: function () {
    //     return {
    //         booksInCart: [
    //             {
    //                 name: "yuan LIN 1",
    //                 quantity: 1,
    //                 price: 10
    //             },
    //             {
    //                 name: "yuan LIN 1",
    //                 quantity: 1,
    //                 price: 10
    //             },
    //             {
    //                 name: "yuan LIN 1",
    //                 quantity: 1,
    //                 price: 10
    //             },
    //             {
    //                 name: "yuan LIN 1",
    //                 quantity: 1,
    //                 price: 10
    //             },
    //             {
    //                 name: "yuan LIN 1",
    //                 quantity: 1,
    //                 price: 10
    //             }
    //         ]
    //     };
    // },
    render: function () {
        // var nodes = this.state.booksInCart.map(function (book, key) {
        var nodes = this.context.cart.map(function (book, key) {
            return (
                <BookInCart key={key} name={book.name} quantity={book.quantity}
                            price={book.price}>
                </BookInCart>
            );
        });

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
    removeBook: function (book) {
        //todo : remove book
        console.log(book);
    },
    removeBook: function (book) {
        //todo : add book
        console.log(book);
    },
    render: function () {
        const btnMarginRight5 = {
            margin: '0 5px',
            width: '30px'
        };

        return (
            <div className="row">
                <div className="col-md-3">
                    <span>Nom : {this.props.name}</span>
                </div>
                <div className="col-md-2">
                    <span>Prix : {this.props.price}</span>
                </div>
                <div className="col-md-5">
                    <span className="col-md-offset-4 col-md-4">Quantité : {this.props.quantity} </span>
                    <button onClick={() => this.removeBook(this.props)} style={btnMarginRight5}> +</button>
                    <button onClick={() => this.removeBook(this.props)} style={btnMarginRight5}> -</button>
                </div>
                <div className="col-md-2">
                    <span>Sous total : {this.props.quantity * this.props.price}</span>
                </div>
            </div>
        );
    }
});

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