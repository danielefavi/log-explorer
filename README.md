Log Explorer: a simple tool to explore and visualize your logs
===============================================================

## What is it?

**Log Explorer** is a NPM package that allows you to explore your logs through a web interface.

It is a simple tool that can be used to quickly analyze your logs and find the information you need.

<!-- <p align="center"><img src="https://raw.githubusercontent.com/danielefavi/npm-log-explorer/master/.github/images/exported-ui-sample.png" width="60%" height="70%" /></p> -->

NPM: https://www.npmjs.com/package/log-explorer  
GitHub: https://github.com/danielefavi/log-explorer

## How to use it?

### Installation

Install the package globally:

```bash
npm install -g log-explorer
```

### Usage

Run the following command in the directory where your logs are located:

```bash
log-explorer
```

This will start a web server on port 4321. You can then access the web interface at http://localhost:4321

If you want to use another port, you can specify it as an argument:

```bash
log-explorer --port 1234
```

### Help

You can get help on the command line by running:

```bash
log-explorer --help
```

## Is your log format not supported?

If your log format is not supported, you can easily add it by creating a new parser in the `log-parser-strategies` directory.  
Then please submit a pull request so that we can add it to the package.