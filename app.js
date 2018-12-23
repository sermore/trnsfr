const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');
const expressHbs = require('express-handlebars');
const helpers = require('./lib/helpers');
const environment = helpers.requireEnvironment();

const indexRouter = require('./routes/index');
const transfersRouter = require('./routes/transfers');
const adminRouter = require('./routes/admin');

const app = express();

// app.locals.environment = environment;

// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'default',
    extname: '.hbs',
    helpers: {
        dateFormat: (date) => date ? date.toLocaleString() : '',
        url: helpers.url
    }
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(path.join(__dirname, 'public')));

// if (app.locals.environment.rootPath) {
//     app.use(app.locals.environment.rootPath, indexRouter);
// }

app.use(helpers.url('/'), indexRouter);
app.use(helpers.url('/transfers'), transfersRouter);
app.use(helpers.url('/admin'), basicAuth({
    users: environment.users,
    // unauthorizedResponse: (req, res, next) => (res.status(401).render('error', { message: 'Unauthorized' })),
    // unauthorizedResponse: req => (req.auth ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') : 'No credentials provided'),
    challenge: true,
    realm: environment.realm
}), (req, res, next) => {
    app.locals.user = req.auth.user;
    next();
});
app.use(helpers.url('/admin'), adminRouter);

app.use(function (req, res, next) {
    // throw new Error('ciao');
    res.status(404).render('404');
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function (err, req, res, next) {
    console.error(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

helpers.lifeCycleHandler();

module.exports = app;
