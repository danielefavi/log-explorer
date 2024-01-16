
export function validateServerPort(port: string|undefined): number {
  if (typeof port === 'undefined') {
    throw new Error('Error: --port requires a port number');
  }

  const portNum = parseInt(port);

  if (isNaN(portNum)) {
    throw new Error('Error: --port is not a valid number');
  } else if (portNum < 0 || portNum > 65535) {
    throw new Error('Error: --port is not a valid port number: the port should be port > 0 and port < 65535');
  }

  return portNum;
}

export function getPort(): number {
  let port = 4321;
  let inx = null;

  if (process.argv.includes('--port')) {
    inx = process.argv.indexOf('--port') + 1;
  } else if (process.argv.includes('-p')) {
    inx = process.argv.indexOf('-p') + 1;
  }

  if (inx !== null) {
    try {
      port = validateServerPort(process.argv[inx] as string);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }
      process.exit(1);
    }
  }
  
  return port;
}