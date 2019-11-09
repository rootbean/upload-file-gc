
const { resolve } = require('path');
const { error } = require('console');
const { name } = require('../package.json');
const { bootstrap, run } = require('../src/service');

const parts = name.split(/\//);
const serviceName = parts[parts.length - 1].replace(/\@|\-/g, '');

bootstrap({
  serviceName,
  appPath: resolve(process.cwd()),
}).then(run).catch(error);
