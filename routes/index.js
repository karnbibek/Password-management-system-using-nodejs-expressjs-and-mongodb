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
/* GET home page. */
router.get('/', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
        res.redirect('./dashboard');
    } else {
        res.render('index', { title: 'Password Management System', msg: "" });
    }
});

router.post('/', function(req, res, next) {
    var username = req.body.uname;
    var password = req.body.password;
    var checkUser = userModule.findOne({ username: username });
    checkUser.exec((err, data) => {
        if (err) throw err;

        var getUserId = data._id;
        var getPassword = data.password;
        if (bcrypt.compareSync(password, getPassword)) {
            var token = jwt.sign({ userId: 'getUserId' }, 'loginToken');
            localStorage.setItem('userToken', token);
            localStorage.setItem('loginUser', username);
            res.redirect('/dashboard');
        } else {
            res.render('index', { title: 'Password Management System', msg: 'Invalid username and password!!!' });
        }
    })

});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
    var loginUser = localStorage.getItem('loginUser');
    if (loginUser) {
        res.redirect('./dashboard');
    } else {
        res.render('signup', { title: 'Password Management System', msg: '' });
    }
});

/* POST signup page. */
router.post('/signup', checkUsername, checkEmail, function(req, res, next) {
    var username = req.body.uname;
    var email = req.body.email;
    var password = req.body.password;
    var confpassword = req.body.confpassword;

    if (password != confpassword) {
        res.render('signup', { title: 'Password Management System', msg: 'Password not Matching!!!' });
    } else {
        password = bcrypt.hashSync(req.body.password, 10);
        var userDetails = new userModule({
            username: username,
            email: email,
            password: password
        });

        userDetails.save((err, doc) => {
            if (err) throw err;
            res.render('signup', { title: 'Password Management System', msg: 'User Registered successfully' });
        })
    }
});

/* logout page. */
router.get('/logout', function(req, res, next) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loginUser');
    res.redirect('/');
});

module.exports = router;