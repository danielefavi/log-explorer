"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatedArgs = exports.getPortFromArgs = void 0;
/**
 * Perform the validation of the port number given in the CLI
 *
 * @param   {string|undefined}  port
 *
 * @return  {number}
 */
function validateServerPort(port) {
    if (typeof port === 'undefined') {
        throw new Error('Error: --port requires a port number');
    }
    const portNum = parseInt(port);
    if (isNaN(portNum)) {
        throw new Error('Error: --port is not a valid number');
    }
    else if (portNum < 0 || portNum > 65535) {
        throw new Error('Error: --port is not a valid port number: the port should be port > 0 and port < 65535');
    }
    return portNum;
}
/**
 * Get the port number from the CLI arguments
 *
 * @return  {number}
 */
function getPortFromArgs(args = process.argv) {
    let port = 4321;
    let inx = null;
    if (args.includes('--port')) {
        inx = args.indexOf('--port') + 1;
    }
    else if (args.includes('-p')) {
        inx = args.indexOf('-p') + 1;
    }
    if (inx !== null) {
        port = validateServerPort(args[inx]);
    }
    return port;
}
exports.getPortFromArgs = getPortFromArgs;
/**
 * Get the validated arguments from the CLI
 *
 * @return  {Settings}
 */
function getValidatedArgs() {
    const settings = {
        port: 4321
    };
    try {
        settings.port = getPortFromArgs();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        else {
            console.error(error);
        }
        process.exit(1);
    }
    return settings;
}
exports.getValidatedArgs = getValidatedArgs;
