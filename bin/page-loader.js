#!/usr/bin/env node
import { Command } from 'commander';
import axiosdebuglog from 'axios-debug-log';
import pageLoad from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Page loader utility.')
  .argument('<url>')
  .option('-V, --version', 'output the version number')
  .helpOption('-h, --help', 'display help for command')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .action((url, option) => {
    pageLoad(url, option.output)
      .then(() => process.exit(console.log(`${url} Loaded Successfully!`)));
  });

program.parse(process.argv);

axiosdebuglog({
  request(debug, config) {
    debug(`Request with ${config.url}`);
  },
  response(debug, response) {
    debug(
      `Response with ${response.headers['content-type']}`,
      `from ${response.config.url}`,
    );
  },
  error(debug, err) {
    debug('Boom', err);
  },
});

export default program;