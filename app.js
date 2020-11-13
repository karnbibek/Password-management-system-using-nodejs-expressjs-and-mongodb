var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var dashboardRouter = require('./routes/dashboard');
var add_new_category = require('./routes/add-new-category');
var passwordCategory = require('./routes/passwordCategory');
var addNewPassword = require('./routes/add-new-password');
var viewAllPassword = require('./routes/view-all-password');
var PasswordDetail = require('./routes/password-detail');
var usersRouter = require('./routes/users');
var joinRouter = require('./routes/join');
const { join } = require('path');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/add-new-category', add_new_category);
app.use('/passwordCategory', passwordCategory);
app.use('/add-new-password', addNewPassword);
app.use('/view-all-password', viewAllPassword);
app.use('/password-detail', PasswordDetail);
app.use('/join', joinRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;