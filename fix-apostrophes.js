const fs = require('fs');
const files = [
  'simulations/kepler.html', 'simulations/hund-rules.html', 'simulations/planck.html',
  'simulations/wien.html', 'simulations/newton-rings.html', 'simulations/maxwell.html',
  'simulations/ampere-law.html', 'simulations/lenz-law.html', 'simulations/faraday-law.html',
  'simulations/pascal.html', 'simulations/young-modulus.html', 'simulations/joule.html',
  'simulations/kirchhoff.html', 'simulations/lenz.html', 'simulations/faraday.html',
  'simulations/oersted.html', 'simulations/coulomb.html', 'simulations/snell-law.html',
  'simulations/bernoulli.html', 'simulations/boyle.html', 'simulations/hooke.html'
];
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/ctx\.fillText\('([A-Za-z]+)'s ([A-Za-z]+)',/g, 'ctx.fillText("$1\'s $2",');
  fs.writeFileSync(file, content);
  console.log('Fixed: ' + file);
});
console.log('Done');