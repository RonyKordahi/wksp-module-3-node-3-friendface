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
        users: users,
        title: `Welcome ${currentUser.name}!`,
        
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
    res.send(`user ID is ${id}`);
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
    .get('*', fourOhFour)
    
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));