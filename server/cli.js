#!/usr/bin/env node
const DOMPurify = require('dompurify');
const fs = require('fs');
const minimist = require('minimist');

const Markdown = require('./../shared/naturalcrit/markdown.js');

const args = minimist(process.argv.slice(2))
if (args._.length === 2 && args._[0] === "assets") {
  createAssets(args).then(() => {});
} else if(args._.length === 1) {
  fileToHtml(args._[0], args);
} else {
  // TODO
}

// const pageText = `#Yow!\n\n&nbsp;\n\\column\n&nbsp;`; //Artificial column break at page end to emulate column-fill:auto (until `wide` is used, when column-fill:balance will reappear)
// const html = Markdown.render(pageText, 0);
// console.log(html)

// TODO use same linting (tabs, ...) as original code
function fileToHtml(file, options) {
  let basePath = './';
  if (options['base-path']) {
    if (typeof options['base-path'] !== 'string') {
      console.error('Expected a value for base-path');
      return;
    }
    if (!fs.existsSync(options['base-path']) || !fs.lstatSync(options['base-path']).isDirectory()) {
      console.error('Invalid base-path value, it\'s not a directory:', options['base-path']);
      return;
    }

    basePath = options['base-path'].endsWith('/') ? options['base-path'] : options['base-path'] + '/';
  }

  fs.readFile(file, 'utf-8', (err, data) => {
    if (err || !data) {
      console.error("Could not read file", file);
      return;
    }

    const pagesHtml = data
      .split(/^\\page$/gm)
      .map(page => {
        const pageText = `${page}\n\n&nbsp;\n\\column\n&nbsp;`;
        return Markdown.render(pageText, 0);
      });
    console.log(toHtml(pagesHtml, basePath));
  });
}

// From <BrewPage /> in brewRenderer.jsx
function brewPage(html, pageIndex) {
  // const purifyConfig = { FORCE_BODY: true, SANITIZE_DOM: false };
	// const cleanText = DOMPurify.sanitize(html, purifyConfig);
	return `<div class="page" id="p${pageIndex + 1}">
	         <div className='columnWrapper'>${html}</div>
	       </div>`;
}

function toHtmlPages(pages) {
  let out = '';
  for (let i=0; i<pages.length; i++) {
    out += brewPage(pages[i], i);
  }
  return `<div className='pages' lang='en'> ${out} </div>`;
}

function toHtml(pages, basePath) {
  return `<!DOCTYPE html>
      <html><head>
			<meta name="viewport" content="width=device-width, initial-scale=1, height=device-height, interactive-widget=resizes-visual">
			<link href="//use.fontawesome.com/releases/v6.5.1/css/all.css" rel="stylesheet" type="text/css">
			<link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css">
			<link href="${basePath}homebrew/bundle.css" type="text/css" rel="stylesheet">
			<link rel="icon" href="/assets/favicon.ico" type="image/x-icon">
			
			<meta name="twitter:card" content="summary">
			<title>The Homebrewery - NaturalCrit</title>
		  <meta name="robots" content="noindex, nofollow"></head>
		<body>
			<main id="reactRoot">
        <div class="homebrew">
          <div>
            <link href="${basePath}themes/V3/Blank/style.css" type="text/css" rel="stylesheet">
            <link href="${basePath}themes/V3/5ePHB/style.css" type="text/css" rel="stylesheet">
            ${toHtmlPages(pages)}
          </div>
        </div>
      </main>
	</body></html>`;
}

// TODO zijn ook assets zoals images?
async function createAssets(options) {
  const inputTargetDir = options._[1];
  const targetDir = inputTargetDir.endsWith('/') ? inputTargetDir.substring(0, inputTargetDir.length-1) : inputTargetDir;
  if (!fs.existsSync(targetDir) || !fs.lstatSync(targetDir).isDirectory()) {
    console.error('Directory does not exist', targetDir);
    return;
  }

  await fs.promises.cp('./build/assets', targetDir + '/assets', {recursive: true});
  await fs.promises.cp('./build/fonts', targetDir + '/fonts', {recursive: true});
  await fs.promises.cp('./build/icons', targetDir + '/icons', {recursive: true});
  await fs.promises.mkdir(targetDir + '/homebrew', {recursive: true});
  await fs.promises.cp('./build/homebrew/bundle.css', targetDir + '/homebrew/bundle.css');
  await fs.promises.cp('./build/themes/V3/5ePHB', targetDir + '/themes/V3/5ePHB', {recursive: true});
  await fs.promises.cp('./build/themes/V3/Blank', targetDir + '/themes/V3/Blank', {recursive: true});
}
