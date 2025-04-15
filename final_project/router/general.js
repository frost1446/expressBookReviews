const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  console.log("Registering user " + users);

  // Create a new user
  users[username] = { password };
  console.log("User registered: ", users[username]);
  console.log("All users: ", users);
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify({ books }, null, 4));
});

// Get book list using promises - Task 10
public_users.get('/books', function (req, res) {
  const booksList = new Promise((resolve, reject) => {
    resolve(books);
  });

  booksList
    .then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(500).send(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn], null, 4));
});

// Get book list based on ISBN using promises - Task 11
public_users.get('/books/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });
  book
    .then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).send(err));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  console.log("Author: ", req.params.author);
  Object.keys(books).forEach((key) => {
    if (books[key].author === req.params.author) {
      return res.send(JSON.stringify(books[key], null, 4));
    }
  });
  console.log("Author not found");
  return res.status(404).send("Author not found");
});

// Get author details using promises - Task 12
public_users.get('/books/author/:author', function (req, res) {
  const author = req.params.author;
  const bookAuthor = new Promise((resolve, reject) => {
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        resolve(books[key]);
      }
    });
    reject("Book not found");
  });
  bookAuthor
    .then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({ message: "Author not found" }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  console.log("Title: ", req.params.title);
  Object.keys(books).forEach((key) => {
    if (books[key].title === req.params.title) {
      return res.send(JSON.stringify(books[key], null, 4));
    }
  });
});

// Get title details using promises - Task 13
public_users.get('/books/title/:title', function (req, res) {
  const title = req.params.title;
  const bookTitle = new Promise((resolve, reject) => {
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        resolve(books[key]);
      }
    });
    reject("Title not found");
  });
  bookTitle
    .then((data) => res.send(JSON.stringify(data, null, 4)))
    .catch((err) => res.status(404).json({ message: "Title not found" }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  console.log("ISBN: ", req.params.isbn);
  res.send(JSON.stringify(books[req.params.isbn].reviews, null, 4));
});

module.exports.general = public_users;
