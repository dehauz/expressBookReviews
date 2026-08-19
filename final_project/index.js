const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let books = require("./router/booksdb.js");
const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    // Check if user is logged in and has valid access token
    if (req.session.authorization) {
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user;
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.get("/books", (req, res) => {
    res.json(books);
});

app.get("/isbn2/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    res.json(books[isbn]);
});

// Get book details based on author
app.get('/author2/:author',function (req, res) {
  //Write your code here
    const author = req.params.author;
    // 1. Obtain all the keys for the 'books' object
    const keys = Object.keys(books);

    const results = [];

    // 2. Iterate through the books and check the author
    for (const key of keys) {
        const book = books[key];

        if (book.author === author) {
            results.push(book);
        }
    }
    res.json(results);
});

app.get('/title2/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
    // 1. Obtain all the keys for the 'books' object
    const keys = Object.keys(books);
  
    const results = [];
  
    // 2. Iterate through the books and check the title
    for (const key of keys) {
        const book = books[key];
  
        if (book.title === title) {
            results.push(book);
        }
    }
    res.json(results);
  });

app.listen(PORT,()=>console.log("Server is running"));
