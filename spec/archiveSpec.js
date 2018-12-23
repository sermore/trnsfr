
const buildArchive = require('../lib/archive');
const unzipper = require('unzipper');
const fs = require('fs');
const path = require('path');
const os = require('os');


describe('archive', function () {

    it('should be able to create a zip', function (done) {
        fs.mkdtemp(path.join(os.tmpdir(), 'trnsf'), (err, folder) => {
            const zipFile = path.join(folder, 'example.zip');
            const output = fs.createWriteStream(zipFile);
            buildArchive('*.json', output).then(out => {
                console.log('zip complete');
                unzipper.Open.file(zipFile).then(d => {
                    console.log(d);
                    expect(d.files.length).toEqual(2);
                    expect(d.files[0].path).toEqual('package-lock.json');
                    expect(d.files[1].path).toEqual('package.json');
                    done();
                });
            });
        });
    });

    it('should be able to create a zip with a folder', function (done) {
        fs.mkdtemp(path.join(os.tmpdir(), 'trnsf'), (err, folder) => {
            const zipFile = path.join(folder, 'example.zip');
            const output = fs.createWriteStream(path.join(folder, 'example.zip'));
            buildArchive(['public/*.html', 'public/stylesheets'], output).then(out => {
                console.log('zip complete');
                unzipper.Open.file(zipFile).then(d => {
                    console.log(d);
                    expect(d.files.length).toEqual(2);
                    expect(d.files[0].path).toEqual('index.html');
                    expect(d.files[1].path).toEqual('stylesheets/style.css');
                    done();
                });
            });
        });
    });

});