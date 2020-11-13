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


/* GET pw_category page. */
router.get('/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    getPassCat.exec(function(err, data) {
        if (err) throw err;
        res.render('password_category', { title: 'Password Management System', loginUser: loginUser, records: data });
    })
});


/* Delete pw_category item. */
router.get('/delete/:id', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var passdelete = passCateModel.findByIdAndDelete(passcat_id);
    passdelete.exec(function(err) {
        if (err) throw err;
        res.redirect('/passwordCategory');
    })
});

/*  Get pw_category item to Edit it. */
router.get('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.params.id;
    var getpassCategory = passCateModel.findById(passcat_id);
    getpassCategory.exec(function(err, data) {
        if (err) throw err;
        res.render('edit_pass_category', { title: 'Password Management System', loginUser: loginUser, errors: '', success: '', records: data, id: passcat_id });

    })
});

/*  Post pw_category item to Edit it. */
router.post('/edit/', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var passcat_id = req.body.id;
    var passwordCategory = req.body.passwordCategory;
    var update_passCat = passCateModel.findByIdAndUpdate(passcat_id, { password_category: passwordCategory });
    update_passCat.exec(function(err, doc) {
        if (err) throw err;
        res.redirect('/passwordCategory')
    })
});


module.exports = router;