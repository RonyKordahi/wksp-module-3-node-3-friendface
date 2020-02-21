'use strict';

const express = require('express');
const morgan = require('morgan');
let currentUser = null;

const { users } = require('./data/users');

const PORT = process.env.PORT || 8000;

const fourOhFour = (req, res) => {
    res.status(404);
    res.render("pages/fourOhFour", {
        title: "Nope!",
        path: req.originalUrl
    })
}

const homepage = (req, res) => {
    if(!currentUser) {
        res.redirect("/signin");
        return;
    }
    res.render("pages/homepage", {
        user: currentUser,
        users: users,
        title: `Welcome ${currentUser.name}! Here is your face!`,
        
    })
}

const signin = (req, res) => {
    if(currentUser) {
        res.redirect("/");
        return;
    }
    res.render("pages/signin", {
        title: "Sign in to FriendFace!",
        users: users
    })
}

const userID = (req, res) => {
    if(!currentUser) {
        res.redirect("/signin");
        return;
    }
    const id = req.params.id;
    const user = users.find(user => user.id === id)
    res.render("pages/userID", {
        user: user,
        users: users,
        title: `${user.name}'s face!`
    })
}

const addFriend = (req, res) => {
    const id = req.params.id;
    currentUser.friends.push(id);
    
    res.redirect("/");
}

const getName = (req, res) => {
    const firstName = req.query.firstName;
    currentUser = users.find(user => user.name === firstName)
    
    if(currentUser) {
        res.redirect("/");
    }
    else {
        res.redirect("/signin");
    }
}

const signOut = (req, res) => {
    currentUser = null;
    res.redirect("/");
}

const FFF = (req, res) => {
    res.render("pages/FFF", {
        currentUser: currentUser,
        users: users,
        title: "Find new faces! Click to add!"
    })
}

// -----------------------------------------------------
// server endpoints
express()
    .use(morgan('dev'))
    .use(express.static('public'))
    .use(express.urlencoded({extended: false}))
    .set('view engine', 'ejs')
    // endpoints

    .get("/", homepage)
    .get("/signin", signin)
    .get("/user/:id", userID)
    .get("/getname", getName)
    .get("/signout", signOut)
    .get("/FFF", FFF)
    .get("/add/:id", addFriend)
    .get('*', fourOhFour)
    
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));