const express = require('express');
const url = require('../lib/helpers').url;

const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('index', { title: 'Express' });
    res.redirect(url('/admin/transfers'));
});

module.exports = router;
