var express = require('express');
var router = express.Router();
var userModule = require('../modules/user');
var passCateModel = require('../modules/password_category');
var passModel = require('../modules/add_password');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
var getPassCat = passCateModel.find({});
var getAllPass = passModel.find({});

function checkLoginUser(req, res, next) {
    var userToken = localStorage.getItem('userToken');
    try {
        var decoded = jwt.verify(userToken, 'loginToken');
    } catch (err) {
        // err
        res.redirect('/');
    }
    next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

function checkEmail(req, res, next) {
    var email = req.body.email;
    var checkExistingEmail = userModule.findOne({ email: email });
    checkExistingEmail.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render('signup', { title: 'Password Management System', msg: 'This email is already taken. Try another,' });
        }
        next();
    })
}

function checkUsername(req, res, next) {
    var uname = req.body.uname;
    var checkExistingUsername = userModule.findOne({ username: uname });
    checkExistingUsername.exec((err, data) => {
        if (err) throw err;
        if (data) {
            return res.render('signup', { title: 'Password Management System', msg: 'This username is already taken. Try another,' });
        }
        next();
    })
}


/* GET view-all-password page. */
router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var perPage = 1;
    var page = req.params.page || 1;

    getAllPass.skip((perPage * page) - perPage)
        .limit(perPage).exec(function(err, data) {
            if (err) throw err;
            passModel.countDocuments({}).exec((err, count) => {
                res.render('view-all-password', { title: 'Password Management System', loginUser: loginUser, records: data, current: page, pages: Math.ceil(count / perPage) });
            });
        });
});

/* GET n-th view-all-password page. */
router.get('/:page', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var perPage = 2;
    var page = req.params.page || 1;

    getAllPass.skip((perPage * page) - perPage)
        .limit(perPage).exec(function(err, data) {
            if (err) throw err;
            passModel.countDocuments({}).exec((err, count) => {
                res.render('view-all-password', { title: 'Password Management System', loginUser: loginUser, records: data, current: page, pages: Math.ceil(count / perPage) });
            });
        });
});

module.exports = router;