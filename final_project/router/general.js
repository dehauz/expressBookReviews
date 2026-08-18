const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(400).json({
          message: "Username and password are required"
      });
  }

  // Check if username already exists
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
      return res.status(409).json({
          message: "Username already exists"
      });
  }

  // Register the new user
  users.push({
      username: username,
      password: password
  });

  res.status(201).json({
      message: "User registered successfully"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    axios.get("http://localhost:5000/books")
        .then(response => {
            res.send(JSON.stringify(response.data,null,4));
        })
        .catch(error => {
            res.status(500).json({
                message: "Error retrieving books",
                error: error.message
            });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn2/${isbn}`)
        .then(response => {
            res.send(JSON.stringify(response.data,null,4));
        })
        .catch(error => {
            res.status(500).json({
                message: "Error retrieving books",
                error: error.message
            });
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
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
    res.send(JSON.stringify(results,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
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
  res.send(JSON.stringify(results,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn]["reviews"],null,4));
});

module.exports.general = public_users;
