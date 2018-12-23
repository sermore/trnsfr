const express = require('express');
const router = express.Router();
const archive = require('../lib/archive');
const sendEmail = require('../lib/email');
const url = require('../lib/helpers').url;

router.get('', (req, res, next) => {
    console.log(`map ${archive.transferMap.size}`);
    const obj = {};
    archive.transferMap.forEach((v,k) => obj[k] = v);
    res.json(obj);
});

router.post('/transfers', (req, res, next) => {
    const p = req.body.params;
    if (!p) {
        res.status(400).render('error', {message: 'Bad request, parameter p is missing or empty'});
    } else {
        const tr = archive.addTransfer(req.body);
        if (req.body.sendEmails) {
            sendEmail(tr);
        }
        res.redirect(url('/admin/transfers'));
    }
});

router.post('/transfers/:id', (req, res, next) => {
    const p = req.body.params;
    if (!p) {
        res.status(400).render('error', {message: 'Bad request, parameter p is missing or empty'});
    } else {
        const tr = archive.transferMap.get(req.params.id);
        tr.update(req.body);
        if (req.body.sendEmails) {
            sendEmail(tr);
        }
        res.redirect(url('/admin/transfers'));
    }
});

router.delete('/transfers/:id', (req, res, next) => {
    const id = req.params.id;
    console.log(`delete ${id}`);
    res.json(archive.transferMap.delete(id));
});

router.get('/transfers', (req, res, next) => {
    console.log(`transfers ${archive.transferMap.size}`);
    res.render('transfers', { transfers: Array.from(archive.transferMap.values()), title: 'Transfer list', layout: 'admin-layout' })
});

router.get('/transfers/params', (req, res, next) => {
   const params = req.query.params;
   const p = params ? (Array.isArray(params) ? params : params.split(',')) : [];
   res.json(archive.runGlob(p));
});


module.exports = router;
