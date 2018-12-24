const createError = require('http-errors');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const basicAuth = require('express-basic-auth');
const helpers = require('./lib/helpers');
const archive = require('./lib/archive');
const environment = helpers.requireEnvironment();


const indexRouter = require('./routes/index');
const transfersRouter = require('./routes/transfers');
const adminRouter = require('./routes/admin');

const app = express();

// app.locals.environment = environment;

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(__dirname + '/views/partials');

const blocks = {};
hbs.registerHelper('extend', function(name, context) {
    let block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    const val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

hbs.registerHelper('dateFormat', (date) => date ? date.toISOString() : '');
hbs.registerHelper('url', helpers.url);
hbs.registerHelper('url2', (p1, p2, options) => helpers.url(p1 + p2));
hbs.registerHelper('isTransferDisabled', (id, options) => archive.isTransferEnabled(id) ? null : options.fn(this));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(helpers.url(''), express.static(__dirname + '/node_modules'));
app.use(helpers.url(''), express.static(path.join(__dirname, 'public')));

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
