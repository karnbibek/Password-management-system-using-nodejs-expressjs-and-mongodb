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


/* GET request for password detail. */
router.get('/', checkLoginUser, function(req, res, next) {
    res.redirect('/dashboard');
});

/* GET request after Edit button clicked. */
router.get('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var getPassDetails = passModel.findById({ _id: id });
    getPassDetails.exec(function(err, data) {
        if (err) throw err;
        getPassCat.exec(function(error, data1) {
            res.render('edit_password_detail', { title: 'Password Management System', loginUser: loginUser, records: data1, record: data, success: '' });
        })
    });
});

/* POST request after Edit button clicked. */
router.post('/edit/:id', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var passcat = req.body.pass_cat;
    var project_name = req.body.project_name;
    var pass_details = req.body.pass_details;
    passModel.findByIdAndUpdate(id, { password_category: passcat, project_name: project_name, password_detail: pass_details }).exec(function(err) {
        if (err) throw err;
        var getPassDetails = passModel.findById({ _id: id });
        getPassDetails.exec(function(err, data) {
            if (err) throw err;
            getPassCat.exec(function(error, data1) {
                if (error) throw error;
                res.render('edit_password_detail', { title: 'Password Management System', loginUser: loginUser, records: data1, record: data, success: 'Password updated successfully!!!' });
            });
        });
    });
});

/* Delete pw_category item. */
router.get('/delete/:id', checkLoginUser, function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    var id = req.params.id;
    var passdelete = passModel.findByIdAndDelete(id);
    passdelete.exec(function(err) {
        if (err) throw err;
        res.redirect('/view-all-password');
    })
});

module.exports = router;