"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CliController {
    process;
    constructor(process) {
        this.process = process;
    }
    static exec(process) {
        (new CliController(process)).cliExec();
    }
    /**
     * Execute the CLI command
     *
     * @returns void
     */
    cliExec() {
        const args = this.process.argv.slice(2);
        switch (args[0]) {
            case '-v':
            case '--version':
                this.version();
                break;
            case '-h':
            case '--help':
                this.help();
                break;
        }
    }
    /**
     * Display the version of the package when the CLI command is executed with
     * the -v or --version option
     *
     * @returns void
     */
    version() {
        const packageJson = require('../../package.json');
        console.log(packageJson.version);
        this.process.exit(1);
    }
    /**
     * Display the help
     *
     * @returns void
     */
    help() {
        console.log('');
        console.log('Log Explorer: a simple tool to explore your logs through a web interface.');
        console.log('Usage: log-explorer [options] [command]');
        console.log('Options:');
        console.log('  -v, --version  output the version number');
        console.log('  -h, --help     output usage information');
        console.log('  -p, --port     specify the port number - default 4321');
        console.log('Example:');
        console.log('log-explorer --port 8877     # start the server on port 8877');
        console.log('');
        this.process.exit(1);
    }
}
exports.default = CliController;
