import { config } from '../package.json';

const defaultConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 5000,
    salt: 'eewew',
  },
  fe: {
    url: 'http://localhost:3000/#',
  },
  mongo: {
    url: `mongodb://localhost:27017/local`,
  },
  session: {
    cookie: {
      secure: false, // TODO: should be true in production environment
    },
    saveUninitialized: false,
    resave: false,
    secret: 'you_should_not_use_default_secret',
  },
};

const testingConfig = {
  server: {
    hostname: '127.0.0.1',
    port: 5000,
    salt: 'eewew',
  },
  fe: {
    url: 'https://mofas.github.io/CSCI-P565-30620/#',
  },
  mongo: {
    url: `mongodb://localhost:27017/local`, //TODO: should target to testing db
  },
  session: {
    cookie: {
      secure: true,
    },
    saveUninitialized: false,
    resave: false,
    secret: 'you_should_not_use_default_secret',
  },
};

const getConfig = () => {
  if (process.env.CONFIG === 'testing') {
    return testingConfig;
  }

  return defaultConfig;
};

const targetConfig = getConfig();

module.exports = targetConfig;
