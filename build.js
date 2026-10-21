// Concatenates lib/ + src/ into one self-contained HTML file.
const fs = require('fs');
const rd = (p) => fs.readFileSync(__dirname + '/' + p, 'utf8');
const out = rd('src/shell.html')
  .replace('/*__HARNESS__*/', () => rd('lib/harness.js'))
  .replace('/*__SOUND__*/', () => rd('lib/sound.js'))
  .replace('/*__HELPERS__*/', () => rd('src/helpers.js'))
  .replace('/*__STORY__*/', () => rd('src/story.js'));
fs.writeFileSync(__dirname + '/on-manga-explainer.html', out);
console.log('built', out.length);
