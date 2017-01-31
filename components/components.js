var {
    Router,
    Route,
    IndexRoute,
    IndexLink,
    Link
} = ReactRouter;

var App = React.createClass({
    getInitialState: function () {
        return {
            jobs: []
        }
    },

    componentDidMount: function () {
        var publicKey = 'f63548d029560ca6297df5eab0ce1184';
        var privateKey = '21fb208a38c9feaf9e8a043d0f6276eba10784e7';
        var ts = new Date().getTime();
        var hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
        var url = "https://gateway.marvel.com/v1/public/characters?apikey=" + publicKey;
        url += "&ts=" + ts + "&hash=" + hash;

        $.get(url, function (res) {
            console.log(res);
        });
        // var _this = this;
        // this.serverRequest =
        //     axios
        //         .get("http://codepen.io/jobs.json")
        //         .then(function(result) {
        //             console.log(result);
        //             _this.setState({
        //                 jobs: result.data.jobs
        //             });
        //         })
    },
    // getInitialState: function () {
    //     return {
    //         cart: [
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

var BookList = React.createClass({
    getInitialState: function () {
        return {
            books: [
                {
                    author: "yuan LIN 1",
                    name: "book 1",
                    pageCount: 100,
                    thumbImg: "http://reactjs.cn/react/img/logo.svg"
                },
                {
                    author: "yuan LIN 2",
                    name: "book 1",
                    pageCount: 200,
                    thumbImg: "http://reactjs.cn/react/img/logo.svg"
                },
                {
                    author: "yuan LIN 3",
                    name: "book 1",
                    pageCount: 200,
                    thumbImg: "http://reactjs.cn/react/img/logo.svg"
                },
                {
                    author: "yuan LIN 4",
                    name: "book 1",
                    pageCount: 200,
                    thumbImg: "http://reactjs.cn/react/img/logo.svg"
                },
                {
                    author: "yuan LIN 5",
                    name: "book 1",
                    pageCount: 200,
                    thumbImg: "http://reactjs.cn/react/img/logo.svg"
                },
                {
                    author: "yuan LIN 6",
                    name: "book 1",
                    pageCount: 200,
                    thumbImg: "http://reactjs.cn/react/img/logo.svg"
                }
            ]
        };
    },
    render: function () {
        var nodes = this.state.books.map(function (book, key) {
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

var BookInList = React.createClass({
    render: function () {
        const imgStyle = {
            width: '100%'
        };
        const marginBottom5 = {
            margin: '0 0 5px'
        };

        return (
            <Link to="/bookDetail">
                <div className="col-md-4" style={marginBottom5}>
                    <div className="col-md-5">
                        <img src={this.props.thumbImg} style={imgStyle}/>
                    </div>

                    <div className="col-md-7">
                        <p style={marginBottom5}>Nom : {this.props.name}</p>
                        <p style={marginBottom5}>Auteur : {this.props.author}</p>
                        <p style={marginBottom5}>Nbr pages : {this.props.pageCount}</p>
                        <p style={marginBottom5}>... ...</p>
                    </div>
                </div>
            </Link>
        );
    }
});

var BookDetail = React.createClass({
    render: function () {
        return (
            <div>
                {/*todo*/}
                book info to complete
            </div>
        );
    }
});

var CartInfo = React.createClass({
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

var BookInCart = React.createClass({
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