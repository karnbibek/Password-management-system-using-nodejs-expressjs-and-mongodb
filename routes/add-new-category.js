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


/* GET addNewcategory page. */
router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');

    res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: '', success: '' });
});

/* POST addNewcategory page. */
router.post('/', checkLoginUser, [body('passwordCategory', 'Enter password category name').isLength({ min: 1 })], function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: errors.mapped(), success: '' });
    } else {
        var passCatName = req.body.passwordCategory;
        var passcatDetails = new passCateModel({
            password_category: passCatName
        });
        passcatDetails.save(function(err, doc) {
            if (err) throw err;
            res.render('addNewCategory', { title: 'Password Management System', loginUser: loginUser, errors: '', success: 'Password category inserted successfully.' });
        });
    }
});

module.exports = router;