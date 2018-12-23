const archiver = require('archiver');
const glob = require('glob');
const fs = require('fs').promises;
const fss = require('fs');
const path = require('path');
const Transfer = require('../models/transfer');

const transferMap = new Map();

function addTransfer(data) {
    const tr = new Transfer(data);
    transferMap.set(tr.id, tr);
    return tr;
}

function isTransferEnabled(id) {
    const tr = transferMap.get(id);
    return tr && tr.isEnabled();
}

function sendTransfer(id, output) {
    const res = transferMap.get(id);
    if (!res) {
        throw new Error('transfer not found');
    }
    res.count++;
    res.last = new Date();
    return buildArchive(res.params, output);
}

function buildArchive(params, output) {
    return new Promise(async (resolve, reject) => {
        const archive = archiver('zip');
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                reject(err);
            }
        });
        archive.on('error', function (err) {
            reject(err);
        });

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve(output);
        });
        output.on('end', function () {
            console.log('Data has been drained');
        });

        archive.pipe(output);
        const p = Array.isArray(params) ? params : Array.of(params);
        for (let i = 0; i < p.length; i++) {
            const param = p[i];
            const files = glob.sync(param);
            console.log(`read ${files}`);
            for (let j = 0; j < files.length; j++) {
                const file = files[j];
                let stats = await fs.stat(file);
                console.log(`${file} ${i} ${j} ${files.length}`);
                if (stats.isDirectory()) {
                    archive.directory(file, path.basename(file), {name: path.basename(file)});
                } else {
                    archive.file(file, {name: path.basename(file)});
                }
            }
        }
        console.log('finalize');
        archive.finalize();
    });
}

function runGlob(params) {
    let res = [];
    for (let i = 0; i < params.length; i++) {
        res = res.concat(glob.sync(params[i]));
    }
    return res;
}

function saveData(dataFile) {
    console.log(`save data ${transferMap.size} `);
    fss.writeFileSync(dataFile, JSON.stringify(Array.from(transferMap)), 'utf-8');
}

function loadData(dataFile) {
    const path = dataFile;
    if (fss.existsSync(path)) {
        const data = JSON.parse(fss.readFileSync(path,));
        for (let i = 0; i < data.length; i++) {
            transferMap.set(data[i][0], new Transfer(data[i][1]));
        }
        console.log(`data loaded ${transferMap.size}`);
    }
}

module.exports = {
    transferMap,
    addTransfer,
    sendTransfer,
    buildArchive,
    isTransferEnabled,
    runGlob,
    loadData,
    saveData,
};
