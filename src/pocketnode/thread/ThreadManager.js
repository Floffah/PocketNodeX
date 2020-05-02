let Threads = require('threads'),
    fs = require('fs'),
    Path = require('path');

class ThreadManager {
    constructor(server) {
        this._server = server;
    }

    getServer() {
        return this._server;
    }

    /**
     * Run a task after a certain amount of time. Will run on a seperate thread.
     * @param {String} Task - The path to the file containing a class extending Task.
     * @returns {Promise<terminate>}
     */
    async runScheduledTask(Task) {
        if(typeof Task !== "string") {
            const err = `${Task} is not a string`;
            this._server.getLogger().error(err);
            return Promise.reject(err);
        }
        if(!fs.existsSync(Path.resolve(Task))) {
            const err = `Could not find requested task file ${Path.resolve(Task)}.`;
            this._server.getLogger().error(err);
            return Promise.reject(err);
        }

        const task = await Threads.spawn(new Threads.Worker(Task));
    }
}

module.exports = ThreadManager;

/**
 * Terminate a thread.
 * @callback terminate
 */
