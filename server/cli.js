#!/usr/bin/env node
const minimist = require('minimist');

const { copyAssets, isCopyAssets } = require('./cli/copy-assets.js');
const { fileToHtml } = require('./cli/file-to-html.js');

const args = minimist(process.argv.slice(2))
if (isCopyAssets(args)) {
  copyAssets(args).then(() => {});

} else if(args._.length === 1) {
  fileToHtml(args._[0], args);

} else {
  console.log('usage: ', 'homebrewery', '[<fileName>|assets] <options>')
  // TODO
}
