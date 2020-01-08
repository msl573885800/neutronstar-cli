const util = require('../lib/util');

util.readDir('lib', ({path}) => {
  console.log(path)
})