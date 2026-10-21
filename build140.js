const fs = require('fs');
const rd = (p) => fs.readFileSync(__dirname + '/' + p, 'utf8');
const vo = fs.readFileSync(__dirname + '/assets/vo.mp3').toString('base64');
const out = rd('src/shell140.html')
  .replace('/*__HARNESS__*/', () => rd('lib/harness.js'))
  .replace('/*__SOUND__*/', () => rd('lib/sound.js'))
  .replace('/*__HELPERS__*/', () => rd('src/helpers.js'))
  .replace('/*__STORY__*/', () => rd('src/story140.js'))
  .replace('/*__VO__*/', () => vo);
fs.writeFileSync(__dirname + '/on-manga-explainer-140s.html', out);
console.log('built', out.length);
