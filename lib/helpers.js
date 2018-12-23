const archive = require('./archive');
const environment = require(process.env.NODE_ENV === 'production' ? '../environment.prod' : '../environment');

function requireEnvironment() {
    return require(process.env.NODE_ENV === 'production' ? '../environment.prod' : '../environment');
}

function lifeCycleHandler() {
    process.stdin.resume();

    archive.loadData(environment.dataFile);

    const handle = (signal) => {
        console.log(`Received ${signal}`);
        archive.saveData(environment.dataFile);
        process.exit();
    };

    process.on('SIGINT', handle);
    process.on('SIGTERM', handle);
    process.on('SIGHUP', handle);
    process.on('SIGQUIT', handle);
    process.on('SIGABRT', handle);
}

function url(path) {
    return environment.baseUrl + path;
}


module.exports = {
    requireEnvironment,
    lifeCycleHandler,
    url,
};

