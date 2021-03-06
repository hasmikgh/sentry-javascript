const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { JSDOM } = require('jsdom');

webpack(
  {
    entry: path.join(__dirname, 'test-code.js'),
    output: {
      path: __dirname,
      filename: 'tmp.js',
    },
    mode: 'production',
  },
  (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    runTests();
  },
);

function runTests() {
  const bundlePath = path.join(__dirname, 'tmp.js');
  const { window } = new JSDOM(``, { runScripts: 'dangerously' });

  window.onerror = function() {
    process.exit(1);
  };

  const myLibrary = fs.readFileSync(bundlePath, { encoding: 'utf-8' });
  const scriptEl = window.document.createElement('script');
  scriptEl.textContent = myLibrary;
  window.document.body.appendChild(scriptEl);
}
