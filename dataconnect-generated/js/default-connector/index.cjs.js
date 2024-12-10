const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'nyces-web-system',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

