
const { compose } = require('glue');
const {
  loadServer,
  loadPlugins,
  glueOptions,
  configure,
} = require('./manifest');

exports.bootstrap = async (runtimeConfig = {}) => {
  await configure(runtimeConfig);
  const server = await loadServer();
  const register = await loadPlugins();
  const options = await glueOptions();

  const service = await compose({ server, register }, options);

  return service;
};

exports.run = async (service) => {
  await service.start();
  service.log(['info'], `service running at: ${service.info.uri}`);
};
