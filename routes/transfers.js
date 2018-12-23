const express = require('express');
const router = express.Router();
const archive = require('../lib/archive');

/* GET users listing. */
router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    if (!archive.isTransferEnabled(id)) {
        res.render('404', {disableHomeLink: true});
    } else {
        res.writeHead(200, {
            'Content-Type': 'application/zip',
            'Content-disposition': 'attachment; filename=content.zip'
        });
        archive.sendTransfer(id, res);
    }
});

// router.post('', function (req, res, next) {
//     var p = req.body.p;
//     if (!p) {
//         res.status(400).send('Bad request, parameter p is missing or empty');
//     } else {
//         const tr = archive.addTransfer(p);
//         res.json(tr);
//     }
// });

module.exports = router;
