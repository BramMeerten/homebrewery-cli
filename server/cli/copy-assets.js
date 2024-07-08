const fs = require('fs');

const copyAssets = async (options) => {
  const {targetDir} = handleArguments(options);

  await fs.promises.cp('./build/assets', targetDir + '/assets', {recursive: true});
  await fs.promises.cp('./build/fonts', targetDir + '/fonts', {recursive: true});
  await fs.promises.cp('./build/icons', targetDir + '/icons', {recursive: true});
  await fs.promises.mkdir(targetDir + '/homebrew', {recursive: true});
  await fs.promises.cp('./build/homebrew/bundle.css', targetDir + '/homebrew/bundle.css');
  await fs.promises.cp('./build/themes/V3/5ePHB', targetDir + '/themes/V3/5ePHB', {recursive: true});
  await fs.promises.cp('./build/themes/V3/Blank', targetDir + '/themes/V3/Blank', {recursive: true});
}

const isCopyAssets = (options) => {
  return options._.length === 2 && options._[0] === "assets";
}

function handleArguments(options) {
  let targetDir = options._[1];
  if (targetDir.endsWith('/')) {
    targetDir = targetDir.substring(0, targetDir.length-1);

  }

  return { targetDir };
}

module.exports = {
  copyAssets, isCopyAssets
};
