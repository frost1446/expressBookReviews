const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check if the username is valid
  if (users[username]) {
    return false;
  }
  return true;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if the password and username are correct
  let user = users[username];
  if (user && user.password === password) {
    return true;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  console.log("Login request received");
  const username = req.body.username;
  const password = req.body.password;

  // Check if the user exists and the password is correct
  if (!authenticatedUser(username, password)) {
    return res.status(300).json({ message: "Invalid login. Check username and password" });
  }

  // Generate a token
  let token = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = { accessToken: token, username: username };
  return res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  console.log("Review request received for ISBN: ", isbn);
  console.log("Book by ISBN: ", books[isbn]);

  console.log("Adding review for ISBN: ", isbn, " by user: ", username);
  console.log("Review: ", review);

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add the review to the book's reviews
  if (books[isbn].reviews[username]) {
    // update the existing review
    console.log("Updating existing review for user: ", username);
    books[isbn].reviews[username] = review;
  } else {
    // add a new review
    console.log("Adding new review for user: ", username);
    books[isbn].reviews[username] = review;
  }


  console.log("Updated reviews: ", books[isbn].reviews);
  return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  console.log("Delete review request received for ISBN: ", isbn);
  console.log("Book by ISBN: ", books[isbn]);

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has a review for this book
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete books[isbn].reviews[username];
  console.log("Updated reviews after deletion: ", books[isbn].reviews);
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
